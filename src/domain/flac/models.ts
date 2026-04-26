/**
 * FLACファイルの技術情報（STREAMINFO）。
 * 全てのプロパティは読み取り専用であり、編集されることはありません。
 */
export interface StreamInfo {
  /** サンプリングレート (Hz) */
  readonly sampleRate?: number;
  /** ビット深度 (bit) */
  readonly bitDepth?: number;
  /** チャンネル数 */
  readonly channels?: number;
  /** 再生時間 (秒) */
  readonly duration?: number;
}

/**
 * トラックのアートワーク情報。
 *
 * IPC通信のボトルネックとレンダラープロセスのメモリ圧迫を避けるため、
 * この型には画像のバイナリデータ (Uint8Array) を含めません。
 */
export interface Picture {
  /** 画像のMIME形式（例: "image/jpeg"） */
  format: string;
  /** 画像データの取得元パス（FLACファイル自身のパス、または新規選択された画像ファイルのパス） */
  sourcePath: string;
  /** 画像バイナリのハッシュ値（MD5）。一括編集時の一致判定に使用します。 */
  hash: string;
}

/**
 * FLACファイルのメタデータを表すドメインモデル。
 */
export interface FlacMetadata {
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

  /** 技術情報 (STREAMINFO) - 読み取り専用 */
  readonly streamInfo?: StreamInfo;
}

/**
 * FLACファイルとそのメタデータのペアを表すドメインモデル。
 */
export interface FlacTrack {
  path: string;
  metadata: FlacMetadata;
}
