import { type Locator, type Page } from '@playwright/test';

export class DropZoneArea {
  readonly root: Locator;

  constructor(private readonly page: Page) {
    // デフォルトで最初の drop-zone-container を対象とする
    this.root = page.locator('.drop-zone-container').first();
  }

  /**
   * 単一のファイル（または複数ファイル）をドロップします。
   * Electron の制限を回避するため、内部的に非表示の input[type="file"] を使用して
   * ネイティブパスを持った本物の File オブジェクトを生成します。
   *
   * @param filePaths ドロップするファイルの絶対パス（単一または配列）
   */
  async dropFiles(filePaths: string | string[]): Promise<void> {
    const paths = Array.isArray(filePaths) ? filePaths : [filePaths];

    await this.page.evaluate(() => {
      const input = document.createElement('input');
      input.type = 'file';
      input.id = 'e2e-hidden-file-input';
      input.multiple = true;
      input.style.display = 'none';
      document.body.appendChild(input);
    });

    await this.page.locator('#e2e-hidden-file-input').setInputFiles(paths);

    await this.page.evaluate(() => {
      const input = document.getElementById('e2e-hidden-file-input') as HTMLInputElement;
      const target = document.querySelector('.drop-zone-container');

      if (input && input.files && target) {
        const dataTransfer = new DataTransfer();
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
  }

  /**
   * フォルダをドロップします。
   * Playwright の setInputFiles は webkitdirectory を指定することで
   * フォルダ内の全ファイルを自動列挙してセットします。
   *
   * @param folderPath ドロップするフォルダの絶対パス
   */
  async dropFolder(folderPath: string): Promise<void> {
    await this.page.evaluate(() => {
      const input = document.createElement('input');
      input.type = 'file';
      input.id = 'e2e-hidden-folder-input';
      input.webkitdirectory = true;
      input.style.display = 'none';
      document.body.appendChild(input);
    });

    try {
      await this.page.locator('#e2e-hidden-folder-input').setInputFiles(folderPath);

      await this.page.evaluate(() => {
        const input = document.getElementById('e2e-hidden-folder-input') as HTMLInputElement;
        const target = document.querySelector('.drop-zone-container');

        if (input && input.files && input.files.length > 0 && target) {
          const dataTransfer = new DataTransfer();
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
    } catch (e) {
      console.warn('Directory drop simulation skipped or failed:', e);
      // クリーンアップ
      await this.page.evaluate(() => {
        document.getElementById('e2e-hidden-folder-input')?.remove();
      });
    }
  }
}
