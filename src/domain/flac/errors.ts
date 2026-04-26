import { APP_ERROR_TYPES } from './constants';

/**
 * アプリケーションにおけるエラー種別のリテラル型。
 * 判別共用体 (Discriminated Union) の識別に利用します。
 */
export type AppErrorType = (typeof APP_ERROR_TYPES)[number];

/**
 * アプリケーションにおけるエラーの付随情報（メタデータ）。
 */
export interface AppErrorOptions {
  /** 対象となったファイルやディレクトリのパス */
  path: string;
  /** 追加の詳細メッセージ（例: OSのエラーメッセージ、ライブラリの例外内容） */
  detail?: string;
}

/**
 * アプリケーションにおける詳細なエラー定義（判別共用体）。
 */
export type AppError =
  | { type: 'FILE_NOT_FOUND'; options: AppErrorOptions }
  | { type: 'PERMISSION_DENIED'; options: AppErrorOptions }
  | { type: 'PARSE_FAILED'; options: AppErrorOptions }
  | { type: 'WRITE_FAILED'; options: AppErrorOptions }
  | { type: 'SCAN_FAILED'; options: AppErrorOptions }
  | { type: 'PICK_IMAGE_FAILED'; options: AppErrorOptions }
  | { type: 'MISSING_REQUIRED_TAG'; options: AppErrorOptions }
  | { type: 'INVALID_RENAME_PATTERN'; options: AppErrorOptions };

/**
 * AppError を生成する共通のファクトリ関数。
 */
const createFactory =
  (type: AppErrorType) =>
  (options: AppErrorOptions): AppError =>
    ({
      type,
      options
    }) as AppError;

/**
 * AppError かどうかの型ガード
 */
export const isAppError = (error: unknown): error is AppError => {
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
export const appErrors = {
  fileNotFound: createFactory('FILE_NOT_FOUND'),
  permissionDenied: createFactory('PERMISSION_DENIED'),
  parseFailed: createFactory('PARSE_FAILED'),
  writeFailed: createFactory('WRITE_FAILED'),
  scanFailed: createFactory('SCAN_FAILED'),
  pickImageFailed: createFactory('PICK_IMAGE_FAILED'),
  missingRequiredTag: createFactory('MISSING_REQUIRED_TAG'),
  invalidRenamePattern: createFactory('INVALID_RENAME_PATTERN')
} as const;
