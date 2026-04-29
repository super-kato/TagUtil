import { expect, e2eTest as test } from '../fixtures';

test.describe('業務ロジックテスト: タグ編集', () => {
  // 各テストで共通のディレクトリ開封フロー
  test.beforeEach(async ({ electronApp, testDataDir, mainPage }) => {
    // 独立した一時ディレクトリを返すように Electron のネイティブダイアログをモック
    await electronApp.evaluate(async ({ dialog }, dir) => {
      dialog.showOpenDialog = async () => ({
        canceled: false,
        filePaths: [dir]
      });
    }, testDataDir);

    // ディレクトリを開く
    await mainPage.toolbar.openDirectoryButton.click();
    await expect(mainPage.trackGrid.rows).toHaveCount(1, { timeout: 15000 });
  });

  test('FLACファイルのメタデータを編集し、正常に保存できること', async ({ mainPage }) => {
    // 1. トラックを選択
    await mainPage.trackGrid.selectTrack(0);
    await expect(mainPage.inspector.root).toBeVisible();

    // 2. メタデータを編集 (タイトル)
    const newTitle = `E2E Edit Test ${Date.now()}`;
    await mainPage.inspector.setTitle(newTitle);
    await mainPage.page.keyboard.press('Tab');

    // 3. 保存実行
    const saveBtn = mainPage.toolbar.saveChangesButton;
    await expect(saveBtn).toBeEnabled({ timeout: 5000 });

    await mainPage.statusBar.toggleLogPanel();
    await saveBtn.click();

    // 保存完了ログを待機
    await expect(async () => {
      const logs = await mainPage.statusBar.getLogs();
      if (!logs.some((l) => l.startsWith('tag:write-tag'))) {
        throw new Error('Waiting for write-tag log...');
      }
    }).toPass({ timeout: 30000 });

    // 保存ボタンが非活性（保存完了）になるのを待つ
    await expect(saveBtn).toBeDisabled({ timeout: 10000 });

    // 4. 整合性確認 (再選択)
    await mainPage.page.keyboard.press('Escape');
    await mainPage.trackGrid.selectTrack(0);

    expect(await mainPage.inspector.titleInput.inputValue()).toBe(newTitle);
  });

  test('複数のフィールドを同時に編集して保存できること', async ({ mainPage }) => {
    await mainPage.trackGrid.selectTrack(0);

    const newArtist = `Artist ${Date.now()}`;
    const newAlbum = `Album ${Date.now()}`;

    await mainPage.inspector.setArtist(newArtist);
    await mainPage.inspector.setAlbum(newAlbum);
    await mainPage.page.keyboard.press('Tab');

    await mainPage.toolbar.saveChangesButton.click();

    // 保存完了待機
    await expect(mainPage.toolbar.saveChangesButton).toBeDisabled({ timeout: 10000 });

    // 検証
    await mainPage.page.keyboard.press('Escape');
    await mainPage.trackGrid.selectTrack(0);

    const metadata = await mainPage.inspector.getMetadata();
    expect(metadata.artist).toBe(newArtist);
    expect(metadata.album).toBe(newAlbum);
  });
});
