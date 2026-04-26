import { formatAppError } from '@domain/flac/app-error-formatter';
import { type AppResult } from '@domain/flac/types';
import { logger } from '@services/platform/logger';

/**
 * 処理の実行結果（成功/失敗/例外）に基づいたロギングを行うラッパー関数。
 * AppResult を返す任意の非同期処理をラップし、結果に応じたログを出力します。
 *
 * @param context 処理の識別子（ログに出力される識別名）
 * @param task 実行する非同期処理
 * @param message 補足メッセージ（任意。パスやパラメータなど）
 * @returns 処理結果
 */
export const withResultLogging = async <R extends AppResult<unknown>>(
  context: string,
  task: () => Promise<R>,
  ...params: unknown[]
): Promise<R> => {
  let result: R;
  try {
    result = await task();
  } catch (error: unknown) {
    logger.error({ context, message: formatAppError(error) }, ...params);
    throw error;
  }

  if (result.type === 'success') {
    logger.info({ context, message: '' }, ...params);
    return result;
  }

  logger.warn({ context, message: formatAppError(result.error) }, ...params);

  return result;
};
