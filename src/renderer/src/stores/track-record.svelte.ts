import type { FlacMetadata, FlacTrack } from '@domain/flac/types';
import { createImageUrl } from '@renderer/utils/image';

/** 1つのFLACファイルとその状態を管理するクラス */
export class TrackRecord {
  /** ファイルの絶対パス (一意の識別子であり、変更不可) */
  readonly path: string;

  /** 編集中のメタデータ */
  metadata = $state<FlacMetadata>()!;

  /** 初期状態（保存時または読み込み時）のメタデータのスナップショット */
  #initialMetadataSnapshot = $state<string>('');

  /** メタデータの画像情報から導出される表示用URL */
  imageUrl = $derived(createImageUrl(this.metadata.picture));

  /** 変更があったかどうかのフラグ */
  isModified = $derived(
    JSON.stringify($state.snapshot(this.metadata)) !== this.#initialMetadataSnapshot
  );

  constructor(path: string, metadata: FlacMetadata) {
    this.path = path;
    this.metadata = metadata;
    // 初期状態をシリアライズして保持
    this.#initialMetadataSnapshot = JSON.stringify($state.snapshot(metadata));
  }

  markAsSaved(): void {
    this.#initialMetadataSnapshot = JSON.stringify($state.snapshot(this.metadata));
  }

  toFlacTrack(): FlacTrack {
    return {
      path: this.path,
      metadata: $state.snapshot(this.metadata)
    };
  }
}
