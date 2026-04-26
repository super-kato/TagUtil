import { TAG_ERROR_TYPES } from './constants';

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
 * TagError を生成する共通のファクトリ関数。
 */
const createFactory =
  (type: TagErrorType) =>
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
  fileNotFound: createFactory('FILE_NOT_FOUND'),
  permissionDenied: createFactory('PERMISSION_DENIED'),
  parseFailed: createFactory('PARSE_FAILED'),
  writeFailed: createFactory('WRITE_FAILED'),
  scanFailed: createFactory('SCAN_FAILED'),
  pickImageFailed: createFactory('PICK_IMAGE_FAILED'),
  missingRequiredTag: createFactory('MISSING_REQUIRED_TAG'),
  invalidRenamePattern: createFactory('INVALID_RENAME_PATTERN')
} as const;
