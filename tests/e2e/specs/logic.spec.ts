import { expect, e2eTest as test } from '../fixtures';

test.describe('業務ロジックテスト: タグ編集', () => {
  test('FLACファイルのメタデータを編集し、正常に保存できること', async ({
    mainPage,
    electronApp,
    testDataDir
  }) => {
    // 独立した一時ディレクトリを返すように Electron のネイティブダイアログをモック
    await electronApp.evaluate(async ({ dialog }, dir) => {
      dialog.showOpenDialog = async () => ({
        canceled: false,
        filePaths: [dir]
      });
    }, testDataDir);

    // 1. ディレクトリを開く
    await mainPage.toolbar.openDirectoryButton.click();

    await expect(mainPage.trackGrid.rows).toHaveCount(1, { timeout: 15000 });
    await mainPage.screenshot('01_ディレクトリ開封後');

    // 2. トラックを選択
    await mainPage.trackGrid.selectTrack(0);
    await expect(mainPage.inspector.root).toBeVisible();

    // 3. メタデータを編集
    const newTitle = `E2E Real IPC Test ${Date.now()}`;
    await mainPage.inspector.setTitle(newTitle);
    await mainPage.page.keyboard.press('Tab');

    // 4. 保存
    const saveBtn = mainPage.toolbar.saveChangesButton;
    await expect(saveBtn).toBeEnabled({ timeout: 5000 });

    await mainPage.statusBar.toggleLogPanel();

    console.log(`--- Clicking Save (Target: ${testDataDir}) ---`);
    await saveBtn.click();

    // 保存完了ログを待機
    await expect(async () => {
      const logs = await mainPage.statusBar.getLogs();
      if (!logs.some((l) => l.startsWith('tag:write-tag'))) {
        throw new Error('Waiting for write-tag log...');
      }
    }).toPass({ timeout: 30000 });

    await expect(saveBtn).toBeDisabled({ timeout: 10000 });
    await mainPage.screenshot('05_保存完了');

    // 5. 整合性確認
    await mainPage.page.keyboard.press('Escape');
    await mainPage.trackGrid.selectTrack(0);
    const titleValue = await mainPage.inspector.root.locator('input').first().inputValue();
    expect(titleValue).toBe(newTitle);

    await mainPage.screenshot('06_最終検証完了');
  });
});
