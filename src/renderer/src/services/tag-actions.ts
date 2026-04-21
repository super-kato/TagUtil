import type { EditableMultiKey, EditableSingleKey } from '@domain/editor/batch-metadata';
import type { FlacTrack, TagResult } from '@domain/flac/types';
import { trackStore } from '@stores/track-store.svelte';
import { TrackRecord } from '@stores/track-record.svelte';
import { uiState } from '@stores/ui-state.svelte';
import { tagEditor } from './tag-editor';
import { tagRepository } from '@infrastructure/tag-repository';

/**
 * スキャン処理の共通的なフローを制御するヘルパー関数。
 */
const handleScanOperation = async (
  operation: () => Promise<TagResult<{ tracks: FlacTrack[]; isLimited: boolean } | null>>
): Promise<void> => {
  uiState.reset();
  uiState.startLoading();

  try {
    const result = await operation();

    if (result.type === 'error') {
      uiState.setError(result);
    } else if (result.value) {
      const { tracks: rawTracks, isLimited } = result.value;
      const tracks = rawTracks.map((t) => new TrackRecord(t.path, t.metadata));

      trackStore.tracks = tracks;
      uiState.setScanLimited(isLimited);
    }
  } finally {
    uiState.stopLoading();
  }
};

/**
 * フォルダ選択ダイアログを開き、中のFLACファイルをスキャンします。
 */
const openAndScanDirectory = async (): Promise<void> => {
  await handleScanOperation(() => tagRepository.scanAndLoadTracks());
};

/**
 * 指定された複数のパスを直接スキャンして読み込みます。
 */
const loadFromPaths = async (targetPaths: string[]): Promise<void> => {
  await handleScanOperation(() => tagRepository.loadTracksFromPaths(targetPaths));
};

/**
 * 選択中のフィールドを更新します。
 */
const updateSelectedSingleField = (key: EditableSingleKey, value: string): void => {
  tagEditor.updateSingleField(trackStore.selectedTracks, key, value);
};

const updateSelectedMultiField = (key: EditableMultiKey, index: number, value: string): void => {
  tagEditor.updateMultiField(trackStore.selectedTracks, key, index, value);
};

const addSelectedMultiFieldValue = (key: EditableMultiKey, value: string = ''): void => {
  tagEditor.addMultiFieldValue(trackStore.selectedTracks, key, value);
};

const applySelectedMultiFieldChange = (
  key: EditableMultiKey,
  oldValue: string | undefined,
  newValue: string | undefined
): void => {
  if (oldValue !== undefined) {
    tagEditor.removeMultiFieldValue(trackStore.selectedTracks, key, oldValue);
  }
  if (newValue !== undefined && newValue !== '') {
    tagEditor.addMultiFieldValue(trackStore.selectedTracks, key, newValue);
  }
};

const removeSelectedMultiFieldValue = (key: EditableMultiKey, value: string): void => {
  tagEditor.removeMultiFieldValue(trackStore.selectedTracks, key, value);
};

/**
 * 画像ファイルを選択し、選択中のトラックに適用します。
 */
const pickAndApplyPicture = async (): Promise<void> => {
  uiState.clearError();
  const result = await tagRepository.pickImage();
  if (result.type === 'error') {
    uiState.setError(result);
  } else if (result.value) {
    tagEditor.applyPicture(trackStore.selectedTracks, result.value);
  }
};

/**
 * 指定されたパスの画像を読み込み、選択中のトラックに適用します（ドラッグ＆ドロップ用）。
 */
const applyPictureFromPath = async (path: string): Promise<void> => {
  uiState.clearError();
  const result = await tagRepository.getImageInfo(path);
  if (result.type === 'error') {
    uiState.setError(result);
  } else if (result.value) {
    tagEditor.applyPicture(trackStore.selectedTracks, result.value);
  }
};

/**
 * 選択中のトラックから画像を消去します。
 */
const removeArtwork = (): void => {
  tagEditor.removePicture(trackStore.selectedTracks);
};

/**
 * 自動採番を実行します。
 */
const applyAutoNumbering = (): void => {
  tagEditor.applyAutoNumbering(trackStore.selectedTracks);
};

/**
 * 選択中の変更を破棄して再読み込みします。
 */
const revertSelected = async (): Promise<void> => {
  uiState.clearError();
  const modifiedSelected = trackStore.selectedTracks.filter((t) => t.isModified);
  if (modifiedSelected.length === 0) {
    return;
  }

  uiState.startLoading();

  try {
    for (const track of modifiedSelected) {
      const result = await tagRepository.readMetadata(track.path);
      if (result.type === 'error') {
        uiState.setError(result);
        break;
      }

      // 取得したドメインモデルを UI モデルに反映
      track.metadata = result.value.metadata;
      track.markAsSaved();
    }
  } finally {
    uiState.stopLoading();
  }
};

/**
 * 変更があったすべてのトラックを保存します。
 */
const saveAllModified = async (): Promise<void> => {
  uiState.clearError();
  const modified = trackStore.tracks.filter((t) => t.isModified);
  if (modified.length === 0) {
    return;
  }

  uiState.startLoading();

  try {
    // インフラ層に渡すためにドメインモデルの配列に整形
    const rawData = modified.map((t) => t.toFlacTrack());
    const result = await tagRepository.saveTracks(rawData);

    if (result.type === 'error') {
      uiState.setError(result);
    } else {
      for (const track of modified) {
        track.markAsSaved();
      }
    }
  } finally {
    uiState.stopLoading();
  }
};

/**
 * ユーザーの操作（ユースケース）に応じた一連のフローを制御するオブジェクト。
 * Storeの状態変更、Editorによるデータ加工、I/Oサービスとの通信をオーケストレーターとしてまとめます。
 */
export const tagActions = {
  openAndScanDirectory,
  loadFromPaths,
  updateSelectedSingleField,
  updateSelectedMultiField,
  addSelectedMultiFieldValue,
  removeSelectedMultiFieldValue,
  applySelectedMultiFieldChange,
  pickAndApplyPicture,
  applyPictureFromPath,
  removeArtwork,
  applyAutoNumbering,
  revertSelected,
  saveAllModified
} as const;
