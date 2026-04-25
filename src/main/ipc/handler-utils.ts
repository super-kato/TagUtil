import { logger } from '@services/platform/logger';

type ResultLike = { type: 'success' | 'error' };

/**
 * IPCハンドラーのメインロジックをラップし、結果（成功/失敗/例外）に基づいたロギングを行います。
 * ハンドラー関数内から直接呼び出して使用します。
 */
export const withResultLogging = async <R extends ResultLike>(
  channel: string,
  task: () => Promise<R>,
  message?: string
): Promise<R> => {
  const logPrefix = message ? ` ${message}` : '';

  try {
    const result = await task();

    if (result.type === 'success') {
      logger.info(`[${channel}]${logPrefix} - succeeded`);
    } else {
      logger.error(`[${channel}]${logPrefix} - failed`);
    }

    return result;
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error(`[${channel}]${logPrefix} - exception: ${errorMsg}`);
    throw error;
  }
};
