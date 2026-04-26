import { APP_ERROR_TYPES } from './constants';

/**
 * AppError 生成時に指定可能なオプション。
 */
export interface AppErrorOptions {
  /** エラーが発生した対象ファイルのパス */
  path?: string;
  /** エラーの詳細情報（スタックトレースやライブラリエラーなど） */
  detail?: string;
  /** 追加のメタデータ */
  metadata?: Record<string, unknown>;
}

/**
 * アプリケーションにおける詳細なエラー定義（判別共用体）。
 */
export type AppError =
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
  (type: (typeof APP_ERROR_TYPES)[number]) =>
  (options: AppErrorOptions = {}): AppError =>
    ({
      type,
      options
    }) as AppError;

/**
 * 指定されたオブジェクトが AppError 型であるかどうかを判定するガード関数。
 */
export const isAppError = (error: unknown): error is AppError => {
  if (!error || typeof error !== 'object') {
    return false;
  }
  const candidate = error as Record<string, unknown>;
  return (
    typeof candidate.type === 'string' &&
    typeof candidate.options === 'object' &&
    candidate.options !== null
  );
};

/**
 * 型安全にエラーオブジェクトを生成するためのファクトリ。
 */
export const appErrors = {
  parseFailed: createFactory('PARSE_FAILED'),
  writeFailed: createFactory('WRITE_FAILED'),
  scanFailed: createFactory('SCAN_FAILED'),
  pickImageFailed: createFactory('PICK_IMAGE_FAILED'),
  missingRequiredTag: createFactory('MISSING_REQUIRED_TAG'),
  invalidRenamePattern: createFactory('INVALID_RENAME_PATTERN')
} as const;
