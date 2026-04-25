import { BrowserWindow } from 'electron';
import { IPC_CHANNELS } from '@shared/ipc';
import { logger } from '@services/platform/logger';

/**
 * メインプロセスのログイベントを監視し、
 * アクティブな全てのレンダラープロセス（ウィンドウ）へ IPC 経由で転送を開始します。
 */
export const startLogForwarding = (): void => {
  logger.on('log', (logMessage) => {
    const windows = BrowserWindow.getAllWindows();
    for (const window of windows) {
      if (!window.isDestroyed()) {
        window.webContents.send(IPC_CHANNELS.ON_LOG_MESSAGE, logMessage);
      }
    }
  });
};
