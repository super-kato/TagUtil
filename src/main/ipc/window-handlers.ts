import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '@shared/ipc';
import { showMainWindow } from '@services/platform/window';

/**
 * ウィンドウ操作に関する IPC ハンドラを登録します。
 */
export const registerWindowHandlers = (): void => {
  ipcMain.handle(IPC_CHANNELS.SHOW_MAIN_WINDOW, (event) => {
    showMainWindow(event.sender);
  });
};
