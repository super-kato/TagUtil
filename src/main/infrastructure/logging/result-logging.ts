import { type TagResult } from '@domain/flac/types';
import { logger } from '@services/platform/logger';
import { formatTagError } from '@shared/utils/tag-error-formatter';

/**
 * 処理の実行結果（成功/失敗/例外）に基づいたロギングを行うラッパー関数。
 * TagResult を返す任意の非同期処理をラップし、結果に応じたログを出力します。
 *
 * @param context 処理の識別子（ログに出力される識別名）
 * @param task 実行する非同期処理
 * @param message 補足メッセージ（任意。パスやパラメータなど）
 * @returns 処理結果
 */
export const withResultLogging = async <R extends TagResult<unknown>>(
  context: string,
  task: () => Promise<R>,
  ...params: unknown[]
): Promise<R> => {
  const logPrefix = params.length > 0 ? ` ${params.join(', ')}` : '';

  try {
    const result = await task();

    if (result.type === 'success') {
      logger.info(`[${context}]${logPrefix}`);
    } else {
      logger.warn(`[${context}]${logPrefix}: ${formatTagError(result.error)}`);
    }

    return result;
  } catch (error: unknown) {
    logger.error(`[${context}]${logPrefix}: ${formatTagError(error)}`);
    throw error;
  }
};
