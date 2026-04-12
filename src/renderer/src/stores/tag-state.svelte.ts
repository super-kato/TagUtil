import {
  deriveCommonMetadata,
  type EditableMultiKey,
  type EditableSingleKey
} from '@domain/editor/batch-metadata';
import type { Picture, TagResult } from '@domain/flac/types';
import { DEFAULT_GENRES } from '@domain/flac/types';
import { createImageUrl } from '@renderer/utils/image';
import { tagIoService } from '../services/tag-io-service.svelte';
import { selectionState } from './selection-state.svelte';
import { statusState } from './status-state.svelte';
import type { TrackRecord } from './types';

/**
 * 複数FLACファイルの読み取り・編集に関する状態とロジックを管理するクラス。
 */
class TagState {
  tracks = $state<TrackRecord[]>([]);
  isLoading = $state(false);

  /** 選択されているトラックのリスト */
  selectedTracks = $derived(this.tracks.filter((t) => selectionState.has(t)));
  /** 選択されたトラック間で共通の値を導出（Mixed Valuesロジック） */
  commonMetadata = $derived(deriveCommonMetadata(this.selectedTracks.map((t) => t.metadata)));
  /** 選択されたトラック間で共通のカバーアートURL */
  commonImageUrl = $derived.by(() => {
    const picState = this.commonMetadata?.picture;
    return picState?.type === 'uniform' ? createImageUrl(picState.value) : null;
  });

  /** ロード済みの全トラックから、サジェスト用のユニークなジャンルリストを導出 */
  allGenres = $derived.by(() => {
    const currentGenres = this.tracks
      .flatMap((t) => t.metadata.genre || [])
      .filter((g): g is string => !!g);
    return [...new Set([...DEFAULT_GENRES, ...currentGenres])].sort();
  });

  /**
   * フォルダ選択ダイアログを開き、中のFLACファイルをスキャンします。
   */
  async openAndScanDirectory(): Promise<void> {
    await this.handleScanOperation(() => tagIoService.scanAndLoadTracks());
  }

  /**
   * 指定された複数のパスを直接スキャンして読み込みます。
   */
  async loadFromPaths(targetPaths: string[]): Promise<void> {
    await this.handleScanOperation(() => tagIoService.loadTracksFromPaths(targetPaths));
  }

  /**
   * スキャン処理の共通的なフロー（ローディング管理、エラーハンドリング、結果適用）を実行します。
   */
  private async handleScanOperation(
    operation: () => Promise<TagResult<{ tracks: TrackRecord[]; isLimited: boolean } | null>>
  ): Promise<void> {
    this.isLoading = true;
    statusState.reset();

    const result = await operation();

    if (result.type === 'error') {
      statusState.setError(result);
    } else if (result.value) {
      const { tracks, isLimited } = result.value;
      this.reset();
      this.tracks = tracks;
      statusState.setScanLimited(isLimited);
    }

    this.isLoading = false;
  }

  /**
   * 選択中のすべてのトラックの特定の単一値フィールドを、即座に一括更新します。
   */
  updateSelectedSingleField(key: EditableSingleKey, value: string): void {
    for (const track of this.selectedTracks) {
      track.metadata[key] = value;
      track.isModified = true;
    }
  }

  /**
   * 選択中のすべてのトラックの複数値フィールドの特定のインデックスを更新します。
   */
  updateSelectedMultiField(key: EditableMultiKey, index: number, value: string): void {
    for (const track of this.selectedTracks) {
      const current = track.metadata[key];
      if (current) {
        current[index] = value;
        track.isModified = true;
      }
    }
  }

  /**
   * 選択中のすべてのトラックの複数値フィールドに新しい値を追加します。
   * 重複の排除（空文字以外）を自動的に行います。
   */
  addSelectedMultiFieldValue(key: EditableMultiKey, value: string = ''): void {
    for (const track of this.selectedTracks) {
      const current = track.metadata[key] || [];
      if (value !== '' && current.includes(value)) {
        continue;
      }
      track.metadata[key] = [...current, value];
      track.isModified = true;
    }
  }

  /**
   * 選択中のすべてのトラックの複数値フィールドから特定のインデックスを削除します。
   */
  removeSelectedMultiFieldValue(key: EditableMultiKey, index: number): void {
    for (const track of this.selectedTracks) {
      const current = track.metadata[key];
      if (current) {
        track.metadata[key] = current.filter((_, i) => i !== index);
        track.isModified = true;
      }
    }
  }

  /**
   * 画像ファイルを選択し、選択中のすべてのトラックに適用します。
   */
  async pickAndApplyPicture(): Promise<void> {
    const result = await tagIoService.pickImage();
    if (result.type === 'error') {
      statusState.setError(result);
    } else if (result.value) {
      this.applyArtwork(result.value);
    }
  }

  /**
   * 選択中のすべてのトラックに画像を適用します。
   */
  private applyArtwork(picture: Picture): void {
    for (const track of this.selectedTracks) {
      track.metadata.picture = picture;
      track.imageUrl = createImageUrl(picture);
      track.isModified = true;
    }
  }

  /**
   * 選択中のすべてのトラックから画像を消去します。
   */
  removeArtwork(): void {
    for (const track of this.selectedTracks) {
      track.metadata.picture = null;
      track.imageUrl = createImageUrl(null);
      track.isModified = true;
    }
  }

  /**
   * 選択中の複数トラックに対して、上から順に 1, 2, ... とトラック番号を自動で割り振ります。
   */
  applyAutoNumbering(): void {
    this.selectedTracks.forEach((track, index) => {
      const num = index + 1;
      track.metadata.trackNumber = num.toString();
      track.isModified = true;
    });
  }

  /**
   * 選択中のトラックのうち、変更があるものの編集を破棄してディスクから再読み込みします。
   */
  async revertSelected(): Promise<void> {
    const modifiedSelected = this.selectedTracks.filter((t) => t.isModified);
    if (modifiedSelected.length === 0) {
      return;
    }

    this.isLoading = true;
    statusState.clearError();

    for (const track of modifiedSelected) {
      const result = await tagIoService.reloadTrack(track);
      if (result.type === 'error') {
        statusState.setError(result);
        break;
      }
    }

    this.isLoading = false;
  }

  /**
   * 変更があったすべてのトラックを保存します。
   */
  async saveAllModified(): Promise<void> {
    const modified = this.tracks.filter((t) => t.isModified);
    await this.saveTracks(modified);
  }

  private async saveTracks(targetTracks: TrackRecord[]): Promise<void> {
    if (targetTracks.length === 0) {
      return;
    }

    this.isLoading = true;
    const result = await tagIoService.saveTracks(targetTracks);

    if (result.type === 'error') {
      statusState.setError(result);
    } else {
      for (const track of targetTracks) {
        track.isModified = false;
      }
    }
    this.isLoading = false;
  }

  reset(): void {
    this.tracks = [];
    statusState.reset();
  }
}

export const tagState = new TagState();
