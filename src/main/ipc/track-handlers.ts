import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '@shared/ipc';
import { showTrackContextMenu } from '@main/services/platform/context-menu';

/**
 * トラック操作に関する IPC ハンドラを登録します。
 */
export const registerTrackHandlers = (): void => {
  // トラックのコンテキストメニューを表示
  ipcMain.handle(IPC_CHANNELS.SHOW_TRACK_CONTEXT_MENU, async (_event, path: string) => {
    showTrackContextMenu(path);
  });
};
