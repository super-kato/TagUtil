import type { FlacMetadata, FlacTrack } from '@domain/flac/models';
import { createImageUrl } from '@renderer/utils/image';
import { isDeepEqual } from '@shared/utils/equality';

/** 1つのFLACファイルとその状態を管理するクラス */
export class TrackRecord {
  /** ファイルの絶対パス (一意の識別子) */
  readonly path: string;

  /** 編集中のメタデータ */
  metadata = $state<FlacMetadata>()!;

  /** 初期状態（保存時または読み込み時）のメタデータのスナップショット */
  #initialMetadataSnapshot = $state<FlacMetadata>()!;

  /** メタデータの画像情報から導出される表示用URL */
  imageUrl = $derived(createImageUrl(this.metadata.picture));

  /** 変更があったかどうかのフラグ */
  isModified = $derived(
    !isDeepEqual($state.snapshot(this.metadata), this.#initialMetadataSnapshot)
  );

  constructor(path: string, metadata: FlacMetadata) {
    this.path = path;
    this.metadata = metadata;
    // 初期状態をスナップショットとして保持
    this.#initialMetadataSnapshot = $state.snapshot(metadata);
  }

  markAsSaved(): void {
    this.#initialMetadataSnapshot = $state.snapshot(this.metadata);
  }

  toFlacTrack(): FlacTrack {
    return {
      path: this.path,
      metadata: $state.snapshot(this.metadata)
    };
  }
}
