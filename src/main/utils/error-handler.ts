import { failure } from '@domain/common/result';
import { TagError, TagErrorOptions, TagResult } from '@domain/flac/types';

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
 * catch 句で受け取った error: unknown を、TagResult の failure に変換します。
 * @param error 発生したエラー
 * @param factory TagError を生成する関数
 * @param options 追加のコンテキスト情報
 * @returns Failure<TagError> を含む TagResult オブジェクト
 */
export const toTagResultFailure = <T>(
  error: unknown,
  factory: (options: TagErrorOptions) => TagError,
  options: TagErrorOptions
): TagResult<T> => {
  const message = error instanceof Error ? error.message : String(error);
  const tagError = factory({ ...options, detail: message });

  return failure(tagError);
};
