import { e2eTest as test, expect } from '../fixtures';

test.describe('アプリケーション基本動作', () => {
  test('アプリが起動し、タイトルが表示されること', async ({ mainPage }) => {
    // タイトルを確認
    await expect(mainPage.page).toHaveTitle(/TagUtil/);

    // 初期状態のUIコンポーネントの存在を確認
    await expect(mainPage.toolbar.root).toBeVisible();
    await expect(mainPage.trackGrid.root).toBeVisible();
    await expect(mainPage.statusBar.root).toBeVisible();

    // 初期状態ではトラックが0件であること
    expect(await mainPage.trackGrid.getTrackCount()).toBe(0);

    // インスペクターが空状態であること
    await expect(mainPage.inspector.emptyState).toBeVisible();

    await mainPage.screenshot('00_アプリ起動直後の初期状態');
  });

  test('ステータスバーのログパネルの開閉ができること', async ({ mainPage }) => {
    // ログパネルを展開
    await mainPage.statusBar.ensureExpanded();
    await expect(mainPage.statusBar.root).toHaveClass(/expanded/);
    await mainPage.screenshot('01_ログパネル展開状態');

    // ログパネルを閉じる (toggle)
    await mainPage.statusBar.toggleLogPanel();
    // アニメーション待ちを考慮して expect で待機
    await expect(mainPage.statusBar.root).not.toHaveClass(/expanded/);
    await mainPage.screenshot('02_ログパネルを閉じた状態');

    // 再度展開
    await mainPage.statusBar.toggleLogPanel();
    await expect(mainPage.statusBar.root).toHaveClass(/expanded/);
    await mainPage.screenshot('03_ログパネルを再度開いた状態');
  });
});
