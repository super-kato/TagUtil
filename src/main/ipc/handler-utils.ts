import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { logger } from '@services/platform/logger';

/**
 * ログ出力を伴うIPCハンドラーを登録します（AOP的アプローチ）。
 * 呼び出し開始と結果（成功/失敗）を自動的にロギングします。
 */
export const handleWithLogging = <Args extends unknown[], R>(
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

      // 戻り値が Result 型 (success/error 判別共用体) の場合の特定ロギング
      if (result && typeof result === 'object' && 'type' in result) {
        const res = result as {
          type: string;
          value?: unknown;
          error?: { type: string; options?: { detail?: string } };
        };
        if (res.type === 'success') {
          logger.info(`IPC [${channel}] call completed successfully.`);
        } else if (res.type === 'error') {
          // TagError 等の構造を想定した詳細ロギング
          const error = res.error;
          const detail = error?.options?.detail ? ` (${error.options.detail})` : '';
          const errorType = error?.type ?? 'UNKNOWN_ERROR';
          logger.error(`IPC [${channel}] call failed: ${errorType}${detail}`);
        }
      } else {
        logger.info(`IPC [${channel}] call completed.`);
      }

      return result;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error(`IPC [${channel}] call threw unexpected exception: ${message}`);
      throw error;
    }
  });
};
