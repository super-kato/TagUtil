import { StreamInfo } from '@domain/flac/models';

/**
 * テキストタグとして読み込み・書き込みをスキップするタグキーのリスト。
 */
export const IGNORE_TAG_KEYS = ['METADATA_BLOCK_PICTURE'] as const;

/** 画像種別: フロントカバー (FLAC仕様) */
export const PICTURE_TYPE_FRONT_COVER = 3;

/**
 * Vorbis Comment タグ。
 * キーは常に大文字、値は重複を許容するため配列で保持します。
 */
export type VorbisTags = Record<string, string[]>;

/**
 * FLACのメタデータ（タグと画像）。
 * 読み取りと書き込みで共通して使用。
 */
export interface RawFlacTags {
  /** Vorbis Comment タグ */
  tags: VorbisTags;

  /** 埋め込まれた画像データ一覧 */
  pictures: RawPicture[];
}

/**
 * 解析された生の画像データ。
 */
export interface RawPicture extends FileContent {
  /** MIME形式（例: "image/jpeg"） */
  mime: string;
}

/**
 * 読み取り時に返される、ファイル情報を含んだFLACデータ。
 */
export interface RawFlacData extends RawFlacTags {
  /** 対象ファイルの絶対パス */
  path: string;
  /** 技術情報 (STREAMINFO) */
  streamInfo: StreamInfo;
}

/**
 * 読み込まれたファイルの内容とメタデータ。
 */
export interface FileContent {
  /** バイナリデータ */
  buffer: Uint8Array;
  /** MD5 ハッシュ値 */
  hash: string;
}
