import type { Result } from '@domain/common/result';
import { TAG_PLACEHOLDERS } from '@shared/constants/placeholders';

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
  /**
   * ジャケット画像データ
   * - Picture: 画像の更新・追加
   * - null: 画像の明示的な削除 (METADATA_BLOCK_PICTURE の削除)
   * - undefined: 変更なし (既存の画像を維持)
   */
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

/**
 * トラックのアートワーク情報。
 *
 * IPC通信のボトルネックとレンダラープロセスのメモリ圧迫を避けるため、
 * この型には画像のバイナリデータ (Uint8Array) を含めません。
 * 画像を表示する際は、sourcePath を元に flac-image:// プロトコル経由で
 * メインプロセスからオンデマンドで取得します。
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
 * ディレクトリのスキャン結果を表すインターフェース。
 */
export interface ScanResult {
  /** 見つかったファイルの絶対パス一覧 */
  paths: string[];
  /** 上限に達してスキャンが打ち切られたかどうか */
  isLimited: boolean;
}

/**
 * タグ操作におけるエラー種別のリテラル一覧。
 */
export const TAG_ERROR_TYPES = [
  'FILE_NOT_FOUND',
  'PERMISSION_DENIED',
  'PARSE_FAILED',
  'WRITE_FAILED',
  'SCAN_FAILED',
  'PICK_IMAGE_FAILED',
  'MISSING_REQUIRED_TAG',
  'INVALID_RENAME_PATTERN'
] as const;

/**
 * タグ操作におけるエラー種別のリテラル型。
 * 判別共用体 (Discriminated Union) の識別に利用します。
 */
export type TagErrorType = (typeof TAG_ERROR_TYPES)[number];

/**
 * タグ操作におけるエラーの付随情報（メタデータ）。
 */
export interface TagErrorOptions {
  /** 対象となったファイルやディレクトリのパス */
  path: string;
  /** 追加の詳細メッセージ（例: OSのエラーメッセージ、ライブラリの例外内容） */
  detail?: string;
}

/**
 * タグ操作における詳細なエラー定義（判別共用体）。
 * 各型に応じたPayload（付随データ）を持つことで、型安全なエラーハンドリングを可能にします。
 */
export type TagError =
  | { type: 'FILE_NOT_FOUND'; options: TagErrorOptions }
  | { type: 'PERMISSION_DENIED'; options: TagErrorOptions }
  | { type: 'PARSE_FAILED'; options: TagErrorOptions }
  | { type: 'WRITE_FAILED'; options: TagErrorOptions }
  | { type: 'SCAN_FAILED'; options: TagErrorOptions }
  | { type: 'PICK_IMAGE_FAILED'; options: TagErrorOptions }
  | { type: 'MISSING_REQUIRED_TAG'; options: TagErrorOptions }
  | { type: 'INVALID_RENAME_PATTERN'; options: TagErrorOptions };

/**
 * TagError を生成する共通のファクトリ関数を作成します。
 */
const createFactory =
  (type: (typeof TAG_ERROR_TYPES)[number]) =>
  (options: TagErrorOptions): TagError =>
    ({
      type,
      options
    }) as TagError;

/**
 * TagError かどうかの型ガード
 */
export const isTagError = (error: unknown): error is TagError => {
  return (
    !!error &&
    typeof error === 'object' &&
    'type' in error &&
    'options' in error &&
    typeof (error as { options: unknown }).options === 'object'
  );
};

/**
 * 型安全にエラーオブジェクトを生成するためのファクトリ。
 */
export const tagErrors = {
  /** 指定されたファイルが見つからない場合のエラー */
  fileNotFound: createFactory('FILE_NOT_FOUND'),
  /** 書き込み権限がない場合のエラー */
  permissionDenied: createFactory('PERMISSION_DENIED'),
  /** ファイルのパースに失敗した場合のエラー */
  parseFailed: createFactory('PARSE_FAILED'),
  /** ファイルへの書き込みに失敗した場合のエラー */
  writeFailed: createFactory('WRITE_FAILED'),
  /** ディレクトリのスキャンに失敗した場合のエラー */
  scanFailed: createFactory('SCAN_FAILED'),
  /** 画像の選択・読み込みに失敗した場合のエラー */
  pickImageFailed: createFactory('PICK_IMAGE_FAILED'),
  /** 必須タグ（フォーマットに含まれるタグ）が欠損している場合のエラー */
  missingRequiredTag: createFactory('MISSING_REQUIRED_TAG'),
  /** リネームパターンが無効な場合（タグが含まれていない等）のエラー */
  invalidRenamePattern: createFactory('INVALID_RENAME_PATTERN')
} as const;
/**
 * リネームパターンで使用されるプレースホルダの定義。
 * 実態は shared/constants/placeholders に定義されています。
 */
export { TAG_PLACEHOLDERS };

/**
 * タグ取得・更新操作の戻り値型。
 * Result型を利用した、例外を投げないエラーハンドリングを強制します。
 */
export type TagResult<T> = Result<T, TagError>;

/**
 * UIで推奨されるデフォルトのジャンルリスト。
 */
export const DEFAULT_GENRES = [
  'Pop',
  'Soundtrack',
  'Jazz',
  'Anime',
  'Game',
  'Classical',
  'World',
  'Electronic',
  'Vocaloid',
  'Instrumental',
  'Metal',
  'Ambient'
] as const;
