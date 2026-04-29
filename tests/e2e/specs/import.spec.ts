import { writeFileSync } from 'fs';
import { join } from 'path';
import { expect, e2eTest as test } from '../fixtures';

test.describe('ファイル読み込みテスト', () => {
  test.beforeEach(async ({ electronApp, testDataDir }) => {
    await electronApp.evaluate(async ({ dialog }, dir) => {
      dialog.showOpenDialog = async () => ({
        canceled: false,
        filePaths: [dir]
      });
    }, testDataDir);
  });

  test('ディレクトリを選択して FLAC ファイルのみが検出されること', async ({
    mainPage,
    testDataDir
  }) => {
    writeFileSync(join(testDataDir, 'dummy.mp3'), 'dummy content');
    writeFileSync(join(testDataDir, '.hidden-file'), 'hidden');

    await mainPage.toolbar.openDirectoryButton.click();
    await expect(mainPage.trackGrid.rows).toHaveCount(1, { timeout: 15000 });

    const titles = await mainPage.trackGrid.getTitles();
    expect(titles.length).toBe(1);
    await mainPage.screenshot('01_ディレクトリ開封_フィルタリング検証');
  });

  test('ファイルをドラッグ＆ドロップして読み込めること', async ({ mainPage, testDataDir }) => {
    const flacPath = join(testDataDir, 'track.flac');
    await expect(mainPage.dropZone.root).toBeVisible();

    await mainPage.dropZone.dropFiles(flacPath);

    // 検証
    await expect(mainPage.trackGrid.rows).toHaveCount(1, { timeout: 10000 });
    await mainPage.screenshot('02_ファイルドロップ成功');
  });

  test('フォルダをドラッグ＆ドロップして読み込めること', async ({ mainPage, testDataDir }) => {
    await expect(mainPage.dropZone.root).toBeVisible();

    await mainPage.dropZone.dropFolder(testDataDir);

    // 検証
    await expect(mainPage.trackGrid.rows).toHaveCount(1, { timeout: 10000 });
    await mainPage.screenshot('03_フォルダドロップ成功');
  });
});
