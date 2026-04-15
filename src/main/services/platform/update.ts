import { dialog } from 'electron';
import { autoUpdater } from 'electron-updater';

/**
 * 自動アップデートの初期化
 * アプリ起動時にチェックを行い、更新があれば自動でダウンロードして通知します。
 */
export const initAutoUpdater = (): void => {
  autoUpdater.allowPrerelease = true;

  // 初回チェックを実行（バックグラウンドで実行）
  autoUpdater.checkForUpdatesAndNotify();
};

/**
 * 手動でアップデートを確認する
 * メニューなどから呼び出された際、更新がない場合やエラー時にダイアログを表示します。
 */
export const checkForUpdates = async (): Promise<void> => {
  try {
    const result = await autoUpdater.checkForUpdates();

    // If no update (result is null or version is the same)
    if (!result || result.updateInfo.version === autoUpdater.currentVersion.version) {
      await dialog.showMessageBox({
        type: 'info',
        title: 'Check for Updates',
        message: `You are already using the latest version (v${autoUpdater.currentVersion.version}).`,
        buttons: ['OK']
      });
      return;
    }

    // If update available, continue with standard notification and download
    await autoUpdater.checkForUpdatesAndNotify();
  } catch (err) {
    dialog.showErrorBox(
      'Update Error',
      `An error occurred while checking for updates:\n${err instanceof Error ? err.message : String(err)}`
    );
  }
};
