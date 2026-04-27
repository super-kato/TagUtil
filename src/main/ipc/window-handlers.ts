import { windowAdapter } from '@main/infrastructure/platform/window-adapter';
import { IPC_CHANNELS } from '@shared/ipc';
import { ipcMain } from 'electron';

/**
 * ウィンドウ操作に関する IPC ハンドラを登録します。
 */
export const registerWindowHandlers = (): void => {
  ipcMain.handle(IPC_CHANNELS.SHOW_MAIN, (event) => {
    windowAdapter.showMainWindow(event.sender);
  });
};
