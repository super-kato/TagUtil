import { selectDirectory } from '@services/platform/dialog';
import { IPC_CHANNELS } from '@shared/ipc';
import { ipcMain } from 'electron';

/**
 * プラットフォーム汎用（OSダイアログ等）のIPCハンドラーを登録します。
 */
export const registerPlatformHandlers = (): void => {
  // フォルダ選択ダイアログを表示
  ipcMain.handle(IPC_CHANNELS.SELECT_DIRECTORY, async () => {
    return await selectDirectory();
  });

  // プラットフォーム情報を取得
  ipcMain.handle(IPC_CHANNELS.GET_PLATFORM, async () => {
    return process.platform;
  });
};
