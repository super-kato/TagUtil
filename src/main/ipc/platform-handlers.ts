import { getPlatform } from '@main/infrastructure/adapters/platform-adaptor';
import { selectDirectory } from '@services/platform/dialog';
import { IPC_CHANNELS } from '@shared/ipc';
import { ipcMain } from 'electron';

/**
 * プラットフォーム汎用（OSダイアログ等）のIPCハンドラーを登録します。
 */
export const registerPlatformHandlers = (): void => {
  // フォルダ選択ダイアログを表示
  ipcMain.handle(IPC_CHANNELS.SELECT_DIR, async () => {
    return await selectDirectory();
  });

  // プラットフォームを取得
  ipcMain.handle(IPC_CHANNELS.PLATFORM, () => {
    return getPlatform();
  });
};
