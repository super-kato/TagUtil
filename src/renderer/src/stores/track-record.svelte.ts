import type { FlacMetadata, FlacTrack } from '@domain/flac/types';
import { createImageUrl } from '@renderer/utils/image';

/**
 * 1つのFLACファイルとその状態を管理するクラス。
 * Svelte 5 の Runes を使用して、データのカプセル化と変更検知の自動化を実現します。
 */
export class TrackRecord {
  /** ファイルの絶対パス (一意の識別子であり、変更不可) */
  readonly path: string;

  /** 編集中のメタデータ */
  metadata = $state<FlacMetadata>()!;

  /** 初期状態（保存時または読み込み時）のメタデータのスナップショット */
  #initialMetadataSnapshot = $state<string>('');

  /** メタデータの画像情報から導出される表示用URL */
  imageUrl = $derived(createImageUrl(this.metadata.picture));

  /**
   * 変更があったかどうかのフラグ
   * 初期状態のスナップショットと比較することで自動的に算出されます。
   */
  isModified = $derived(
    JSON.stringify($state.snapshot(this.metadata)) !== this.#initialMetadataSnapshot
  );

  constructor(path: string, metadata: FlacMetadata) {
    this.path = path;
    this.metadata = metadata;
    // 初期状態をシリアライズして保持
    this.#initialMetadataSnapshot = JSON.stringify($state.snapshot(metadata));
  }

  /**
   * 現在の変更を「保存済み」として確定させ、変更フラグをリセットします。
   */
  markAsSaved(): void {
    this.#initialMetadataSnapshot = JSON.stringify($state.snapshot(this.metadata));
  }

  /**
   * 現在のメタデータのスナップショットを、プレーンなドメインオブジェクトとして返します。
   * インフラ層（IoService）にデータを渡す際、プロキシを外すために使用します。
   */
  toFlacTrack(): FlacTrack {
    return {
      path: this.path,
      metadata: $state.snapshot(this.metadata)
    };
  }
}
