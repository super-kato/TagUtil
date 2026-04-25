import { BrowserWindow } from 'electron';
import { IPC_CHANNELS } from '@shared/ipc';
import { logger } from '@services/platform/logger';
import { registerFlacHandlers } from './flac-handlers';
import { registerPlatformHandlers } from './platform-handlers';

/**
 * すべてのIPCハンドラーを一括登録します。
 */
export const registerIpcHandlers = (): void => {
  registerPlatformHandlers();
  registerFlacHandlers();

  // ログメッセージをレンダラープロセスに転送
  logger.on('log', (logMessage) => {
    const windows = BrowserWindow.getAllWindows();
    for (const window of windows) {
      if (!window.isDestroyed()) {
        window.webContents.send(IPC_CHANNELS.ON_LOG_MESSAGE, logMessage);
      }
    }
  });
};
