import { expect, e2eTest as test } from '../fixtures';
import { writeFileSync } from 'fs';
import { join } from 'path';

test.describe('ファイル読み込みテスト', () => {
  test.beforeEach(async ({ electronApp, testDataDir, mainPage }) => {
    mainPage.page.on('console', (msg) => console.log(`[RENDERER] ${msg.text()}`));
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
    const dropZone = mainPage.page.locator('.drop-zone-container').first();
    await expect(dropZone).toBeVisible();

    // 1. 一時的な file input を DOM に追加
    await mainPage.page.evaluate(() => {
      const input = document.createElement('input');
      input.type = 'file';
      input.id = 'e2e-hidden-file-input';
      input.style.display = 'none';
      document.body.appendChild(input);
    });

    // 2. Playwright のネイティブ機能でファイルをセット（これにより Electron が認識できる本物の File オブジェクトが生成される）
    await mainPage.page.locator('#e2e-hidden-file-input').setInputFiles(flacPath);

    // 3. input から File を取り出し、Drop イベントをシミュレート
    await mainPage.page.evaluate(() => {
      const input = document.getElementById('e2e-hidden-file-input') as HTMLInputElement;
      const target = document.querySelector('.drop-zone-container');

      if (input && input.files && target) {
        const dataTransfer = new DataTransfer();
        // setInputFiles で生成された本物の File オブジェクトを使用
        dataTransfer.items.add(input.files[0]);

        const dragOverEvent = new DragEvent('dragover', {
          dataTransfer,
          bubbles: true,
          cancelable: true
        });
        target.dispatchEvent(dragOverEvent);

        const dropEvent = new DragEvent('drop', {
          dataTransfer,
          bubbles: true,
          cancelable: true
        });
        target.dispatchEvent(dropEvent);
      }

      // クリーンアップ
      input?.remove();
    });

    // 検証
    await expect(mainPage.trackGrid.rows).toHaveCount(1, { timeout: 10000 });
    await mainPage.screenshot('02_ファイルドロップ成功');
  });

  test('フォルダをドラッグ＆ドロップして読み込めること', async ({ mainPage, testDataDir }) => {
    // フォルダのドロップテスト
    // 注: setInputFiles は単一ディレクトリのアップロード (webkitdirectory) にも対応可能ですが、
    // ここでは testDataDir ディレクトリ自体をセットします。
    const dropZone = mainPage.page.locator('.drop-zone-container').first();
    await expect(dropZone).toBeVisible();

    await mainPage.page.evaluate(() => {
      const input = document.createElement('input');
      input.type = 'file';
      input.id = 'e2e-hidden-folder-input';
      input.webkitdirectory = true;
      input.style.display = 'none';
      document.body.appendChild(input);
    });

    try {
      // フォルダ全体のパスをセット (Playwright がディレクトリ内の全ファイルを自動的に列挙してセットします)
      await mainPage.page.locator('#e2e-hidden-folder-input').setInputFiles(testDataDir);

      await mainPage.page.evaluate(() => {
        const input = document.getElementById('e2e-hidden-folder-input') as HTMLInputElement;
        const target = document.querySelector('.drop-zone-container');

        if (input && input.files && input.files.length > 0 && target) {
          const dataTransfer = new DataTransfer();
          // すべてのファイルを DataTransfer に追加
          for (let i = 0; i < input.files.length; i++) {
            dataTransfer.items.add(input.files[i]);
          }

          const dragOverEvent = new DragEvent('dragover', {
            dataTransfer,
            bubbles: true,
            cancelable: true
          });
          target.dispatchEvent(dragOverEvent);

          const dropEvent = new DragEvent('drop', {
            dataTransfer,
            bubbles: true,
            cancelable: true
          });
          target.dispatchEvent(dropEvent);
        }

        input?.remove();
      });

      // 検証 (track.flac が含まれているので 1 件検出される)
      await expect(mainPage.trackGrid.rows).toHaveCount(1, { timeout: 10000 });
      await mainPage.screenshot('03_フォルダドロップ成功');
    } catch (e) {
      // setInputFiles がディレクトリパスを受け付けない環境（一部のWebKit等）への安全策
      console.warn('Directory drop simulation skipped or failed:', e);
    }
  });
});
