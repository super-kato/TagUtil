import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { logger } from '@services/platform/logger';

type ResultLike = { type: 'success' | 'error' };

/**
 * ログ出力を伴うIPCハンドラーを登録します（AOP的アプローチ）。
 * 呼び出し開始と結果（成功/失敗）を自動的にロギングします。
 * 本ユーティリティは Result 型（{type: 'success' | 'error'}）を返すハンドラー専用です。
 */
export const handleWithLogging = <Args extends unknown[], R extends ResultLike>(
  channel: string,
  handler: (event: IpcMainInvokeEvent, ...args: Args) => Promise<R>
): void => {
  ipcMain.handle(channel, async (event, ...args: unknown[]) => {
    // 呼び出し開始のログ
    const argsStr = args
      .map((arg) => (typeof arg === 'string' ? arg : JSON.stringify(arg)))
      .join(', ');

    logger.info(`IPC [${channel}] call started. Args: ${argsStr}`);

    try {
      const result = await handler(event, ...(args as Args));

      // 成功/失敗の簡潔なロギング
      if (result.type === 'success') {
        logger.info(`IPC [${channel}] call succeeded.`);
      } else {
        logger.error(`IPC [${channel}] call failed.`);
      }

      return result;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error(`IPC [${channel}] call threw exception: ${message}`);
      throw error;
    }
  });
};
