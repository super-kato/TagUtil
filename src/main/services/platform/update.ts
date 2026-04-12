import { autoUpdater } from 'electron-updater';

/**
 * 自動アップデートの初期化
 * アプリ起動時にチェックを行い、更新があれば自動でダウンロードして通知します。
 */
export const initAutoUpdater = (): void => {
  autoUpdater.checkForUpdatesAndNotify();
};

/**
 * 手動でアップデートを確認する
 */
export const checkForUpdates = async (): Promise<void> => {
  await autoUpdater.checkForUpdatesAndNotify();
};
