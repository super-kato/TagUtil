import { e2eTest as test, expect } from '../fixtures';
import { join } from 'path';

test.describe('業務ロジックテスト: リネーム', () => {
  test('メタデータに基づいてファイルを正常にリネームできること', async ({
    mainPage,
    electronApp
  }) => {
    const fixturesDir = join(process.cwd(), 'tests/e2e/fixtures');

    // レンダラープロセスのコンソールログを転送
    mainPage.page.on('console', (msg) => console.log(`[RENDERER] ${msg.text()}`));

    await electronApp.evaluate(async (electronModule, dir) => {
      const { ipcMain } = electronModule;
      ipcMain.removeHandler('app:select-dir');
      ipcMain.handle('app:select-dir', async (): Promise<string> => dir);
    }, fixturesDir);

    // 1. 設定でリネームルールを構成 (画面操作で行う)
    await mainPage.toolbar.settingsButton.click();
    const ruleInput = mainPage.page.locator('input#setting-rename-pattern');
    await expect(ruleInput).toBeVisible({ timeout: 10000 });
    await ruleInput.fill('%title%');
    await mainPage.page.locator('button[aria-label="Save Changes"]').click();
    await expect(ruleInput).not.toBeVisible();

    // 2. ディレクトリを開く
    await mainPage.toolbar.openDirectoryButton.click();
    await expect(mainPage.trackGrid.rows).toHaveCount(1, { timeout: 15000 });

    // 3. トラックを選択してタイトルを変更 (リネーム対象にするため)
    await mainPage.trackGrid.selectTrack(0);
    const newTitle = `RenameTest_${Date.now()}`;
    await mainPage.inspector.setTitle(newTitle);
    await mainPage.page.keyboard.press('Tab');

    // 4. 保存
    const saveBtn = mainPage.toolbar.saveChangesButton;
    await expect(saveBtn).toBeEnabled();
    await saveBtn.click();

    // 保存完了をログで待機
    await expect(async () => {
      const logs = await mainPage.statusBar.getLogs();
      if (!logs.some((l) => l.startsWith('tag:write-tag'))) {
        throw new Error('Waiting for write-tag');
      }
    }).toPass({ timeout: 30000 });
    await expect(saveBtn).toBeDisabled({ timeout: 10000 });

    // 5. リネーム実行
    // 保存後に選択を維持/再確認
    await mainPage.trackGrid.selectTrack(0);
    const renameBtn = mainPage.toolbar.renameFilesButton;
    await expect(renameBtn).toBeEnabled({ timeout: 10000 });

    console.log('--- Clicking Rename ---');
    await renameBtn.click();

    // 6. 確認ダイアログのボタンを確実に特定してクリック
    console.log('--- Waiting for Confirm Dialog ---');
    // .custom-modal dialog[open] の中にある Confirm ボタン
    const confirmBtn = mainPage.page.locator(
      'dialog[open] .modal-footer button[aria-label="Confirm"]'
    );

    // 出現を待つ
    await expect(confirmBtn).toBeVisible({ timeout: 10000 });
    await mainPage.screenshot('rename_dialog_detected');

    await confirmBtn.click();

    // 7. リネーム完了ログを待機
    await expect(async () => {
      const logs = await mainPage.statusBar.getLogs();
      if (!logs.some((l) => l.startsWith('tag:rename'))) {
        throw new Error('Waiting for rename log');
      }
    }).toPass({ timeout: 20000 });

    await mainPage.screenshot('rename_complete_final');
  });
});
