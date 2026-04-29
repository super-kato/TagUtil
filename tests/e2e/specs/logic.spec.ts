import { e2eTest as test, expect } from '../fixtures';
import { join } from 'path';

test.describe('業務ロジックテスト: タグ編集', () => {
  test('FLACファイルのメタデータを編集し、正常に保存できること', async ({
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

    // 1. ディレクトリを開く
    await mainPage.toolbar.openDirectoryButton.click();
    await expect(mainPage.trackGrid.rows).toHaveCount(1, { timeout: 15000 });
    await mainPage.screenshot('01_ディレクトリ開封後');

    // 2. トラックを選択
    await mainPage.trackGrid.selectTrack(0);
    await expect(mainPage.inspector.root).toBeVisible();
    await mainPage.screenshot('02_トラック選択後');

    // 3. メタデータを編集 (タイトル)
    const newTitle = `E2E Edit Test ${Date.now()}`;
    await mainPage.inspector.setTitle(newTitle);
    await mainPage.page.keyboard.press('Tab');
    await mainPage.screenshot('03_メタデータ入力後');

    // 保存ボタンが活性化していることを確認
    const saveBtn = mainPage.toolbar.saveChangesButton;
    await expect(saveBtn).toBeEnabled({ timeout: 5000 });
    
    // ログパネルを展開
    await mainPage.statusBar.toggleLogPanel();

    // 4. 保存実行
    console.log('--- Clicking Save ---');
    await saveBtn.click();
    await mainPage.screenshot('04_保存クリック直後');
    
    // 保存完了ログを待機 (context: text の形式)
    await expect(async () => {
      const logs = await mainPage.statusBar.getLogs();
      if (!logs.some((l) => l.startsWith('tag:write-tag'))) {
        throw new Error('Waiting for write-tag log...');
      }
    }).toPass({ timeout: 30000 });

    // 保存ボタンが非活性（保存完了）になるのを待つ
    await expect(saveBtn).toBeDisabled({ timeout: 10000 });
    await mainPage.screenshot('05_保存完了');

    // 5. 再読み込み後の整合性確認 (選択し直してインスペクターの値を見る)
    await mainPage.page.keyboard.press('Escape'); // 一旦選択解除
    await mainPage.trackGrid.selectTrack(0);
    
    const titleValue = await mainPage.inspector.root.locator('input').first().inputValue();
    expect(titleValue).toBe(newTitle);
    
    await mainPage.screenshot('06_最終検証完了');
  });
});
