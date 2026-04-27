import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '@shared/ipc';
import { showTrackContextMenu } from '@main/services/platform/context-menu';

/**
 * コンテキストメニューに関連するIPCハンドラーを登録します。
 */
export const registerContextMenuHandlers = (): void => {
  ipcMain.handle(IPC_CHANNELS.SHOW_TRACK_CONTEXT_MENU, (_event, path: string) => {
    showTrackContextMenu(path);
  });
};
