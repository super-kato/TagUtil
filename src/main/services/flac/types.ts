import { StreamInfo } from '@domain/flac/models';

/**
 * ライブラリに依存しない、FLACの生のメタデータ構造。
 */
export interface RawFlacData {
  /** 対象ファイルの絶対パス */
  path: string;

  /**
   * Vorbis Comment タグ。
   * キーは常に大文字で保持し、値は重複を許容するため配列で保持します。
   */
  tags: Record<string, string[]>;

  /** 埋め込まれた画像データ一覧 */
  pictures: RawPicture[];

  /** 技術情報 (STREAMINFO) */
  streamInfo: StreamInfo;
}

/**
 * 解析された生の画像データ。
 */
export interface RawPicture {
  /** MIME形式（例: "image/jpeg"） */
  mime: string;
  /** 画像バイナリ */
  buffer: Uint8Array;
  /** 画像バイナリのハッシュ値（MD5） */
  hash: string;
}
