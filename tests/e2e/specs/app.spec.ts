import { e2eTest, expect } from '../fixtures';

e2eTest.describe('App Initialization', () => {
  e2eTest('アプリケーションが起動し、初期状態が正しいこと', async ({ mainPage }) => {
    // タイトルの確認
    expect(await mainPage.getTitle()).toBe('TagUtil');

    // ツールバーの初期状態（ファイルが読み込まれていないので無効化されているべき）
    await expect(mainPage.toolbar.renameFilesButton).toBeDisabled();
    await expect(mainPage.toolbar.revertChangesButton).toBeDisabled();
    await expect(mainPage.toolbar.saveChangesButton).toBeDisabled();

    // グリッドとインスペクターの初期状態（空）
    await expect(mainPage.trackGrid.emptyState).toBeVisible();
    expect(await mainPage.trackGrid.getTrackCount()).toBe(0);

    expect(await mainPage.inspector.isEditingEnabled()).toBe(false);
    await expect(mainPage.inspector.emptyState).toBeVisible();

    await mainPage.screenshot('initial-state');
  });

  e2eTest('ステータスバーのログパネルの開閉ができること', async ({ mainPage }) => {
    // 初期状態は開いている (App.svelte 等の実装による)
    // ログパネルの表示をトグルする
    await mainPage.statusBar.toggleLogs();

    // パネルが閉じたことを確認
    await expect(mainPage.statusBar.logPanel).toBeHidden();

    // 再度トグル
    await mainPage.statusBar.toggleLogs();
    await expect(mainPage.statusBar.logPanel).toBeVisible();
  });
});
