import { failure } from '@domain/common/result';
import { AppResult } from '@domain/flac/types';
import { AppError, AppErrorOptions } from '@domain/flac/errors';

/**
 * 指定されたエラーコードを持つエラーオブジェクトかどうかを判定します（Type Guard）。
 */
export const hasErrorCode = (error: unknown, code: string): error is { code: string } => {
  return (
    error !== null &&
    typeof error === 'object' &&
    'code' in error &&
    (error as Record<string, unknown>).code === code
  );
};

/**
 * catch 句で受け取った error: unknown を、AppResult の failure に変換します。
 * @param error 発生したエラー
 * @param factory AppError を生成する関数
 * @param options 追加のコンテキスト情報
 * @returns Failure<AppError> を含む AppResult オブジェクト
 */
export const toAppResultFailure = <T>(
  error: unknown,
  factory: (options: AppErrorOptions) => AppError,
  options: AppErrorOptions
): AppResult<T> => {
  const message = error instanceof Error ? error.message : String(error);
  const appError = factory({ ...options, detail: message });

  return failure(appError);
};
