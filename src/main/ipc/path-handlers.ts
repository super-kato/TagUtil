import { IPC_CHANNELS } from '@shared/ipc';
import { ipcMain } from 'electron';
import path from 'path';

/**
 * パス操作に関連するIPCハンドラーを登録します。
 */
export const registerPathHandlers = (): void => {
  // ディレクトリ名を取得
  ipcMain.handle(IPC_CHANNELS.PATH_DIRNAME, (_event, p: string) => {
    return path.dirname(p);
  });

  // パスを結合
  ipcMain.handle(IPC_CHANNELS.PATH_JOIN, (_event, ...paths: string[]) => {
    return path.join(...paths);
  });
};
