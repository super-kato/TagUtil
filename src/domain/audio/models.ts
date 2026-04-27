/**
 * トラックのアートワーク情報。
 *
 * IPC通信のボトルネックとレンダラープロセスのメモリ圧迫を避けるため、
 * この型には画像のバイナリデータ (Uint8Array) を含めません。
 */
export interface Picture {
  /** 画像のMIME形式（例: "image/jpeg"） */
  format: string;
  /** 画像データの取得元パス（音声ファイル自身のパス、または新規選択された画像ファイルのパス） */
  sourcePath: string;
  /** 画像バイナリのハッシュ値（MD5）。一括編集時の一致判定に使用します。 */
  hash: string;
}

/**
 * 音声ファイルのメタデータを表す基本ドメインモデル。
 */
export interface AudioMetadata {
  /** タイトル (TITLE) */
  title?: string;
  /** アーティスト (ARTIST) - 複数値対応 */
  artist?: string[];
  /** アルバム名 (ALBUM) */
  album?: string;
  /** アルバムアーティスト (ALBUMARTIST) - 複数値対応 */
  albumArtist?: string[];
  /** トラック番号 (TRACKNUMBER) */
  trackNumber?: string;
  /** 総トラック数 (TRACKTOTAL / TOTALTRACKS) */
  trackTotal?: string;
  /** ディスク番号 (DISCNUMBER) */
  discNumber?: string;
  /** 総ディスク数 (DISCTOTAL / TOTALDISCS) */
  discTotal?: string;
  /** ジャンル (GENRE) - 複数値対応 */
  genre?: string[];
  /** リリース日 (DATE) - ISO 8601形式 (YYYY or YYYY-MM-DD) */
  date?: string;
  /** 汎用コメント (COMMENT) - 複数値対応 */
  comment?: string[];
  /** 企画番号 (CATALOGNUMBER) */
  catalogNumber?: string;
  /** ジャケット画像データ */
  picture?: Picture | null;
}

/**
 * 音声ファイルとそのメタデータのペアを表す基本ドメインモデル。
 */
export interface AudioTrack<T extends AudioMetadata = AudioMetadata> {
  path: string;
  metadata: T;
}
