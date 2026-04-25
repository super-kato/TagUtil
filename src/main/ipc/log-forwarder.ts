import { IPC_CHANNELS } from '@shared/ipc';
import { logger } from '@services/platform/logger';
import { windowAdapter } from '@main/infrastructure/adapters/window-adapter';

/**
 * メインプロセスのログイベントを監視し、
 * アクティブな全てのレンダラープロセス（ウィンドウ）へ IPC 経由で転送を開始します。
 */
export const startLogForwarding = (): void => {
  logger.onLog((logMessage) => {
    windowAdapter.sendToAllWindows(IPC_CHANNELS.ON_LOG_MESSAGE, logMessage);
  });
};
