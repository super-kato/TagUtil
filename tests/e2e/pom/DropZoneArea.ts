import { type Locator, type Page } from '@playwright/test';

export class DropZoneArea {
  readonly root: Locator;

  /**
   * @param page Playwright の Page オブジェクト
   * @param targetLocator ドロップ対象とする .drop-zone-container の Locator。
   *                      指定がない場合は最初のものを対象とします。
   */
  constructor(
    private readonly page: Page,
    targetLocator?: Locator
  ) {
    this.root = targetLocator ?? page.locator('.drop-zone-container').first();
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
    await this.simulateDrop(paths, { isFolder: false });
  }

  /**
   * フォルダをドロップします。
   * Playwright の setInputFiles は webkitdirectory を指定することで
   * フォルダ内の全ファイルを自動列挙してセットします。
   *
   * @param folderPath ドロップするフォルダの絶対パス
   */
  async dropFolder(folderPath: string): Promise<void> {
    await this.simulateDrop(folderPath, { isFolder: true });
  }

  /**
   * 内部で共通利用するドロップシミュレーションロジック
   */
  private async simulateDrop(
    paths: string | string[],
    options: { isFolder: boolean }
  ): Promise<void> {
    const inputId = `e2e-hidden-${options.isFolder ? 'folder' : 'file'}-input`;

    // 1. 非表示の input を DOM に生成
    await this.page.evaluate(
      ({ id, isFolder }) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.id = id;
        input.style.display = 'none';
        if (isFolder) {
          input.webkitdirectory = true;
        } else {
          input.multiple = true;
        }
        document.body.appendChild(input);
      },
      { id: inputId, isFolder: options.isFolder }
    );

    try {
      // 2. Playwright の機能でネイティブパスを含む File をセット
      await this.page.locator(`#${inputId}`).setInputFiles(paths);

      // 3. DropZone 要素に対して dispatchEvent を実行
      await this.root.evaluate((target, id) => {
        const input = document.getElementById(id) as HTMLInputElement;

        // ガード節
        if (!input || !input.files || input.files.length === 0 || !target) {
          input?.remove();
          return;
        }

        const dataTransfer = new DataTransfer();
        for (let i = 0; i < input.files.length; i++) {
          dataTransfer.items.add(input.files[i]);
        }

        target.dispatchEvent(
          new DragEvent('dragover', { dataTransfer, bubbles: true, cancelable: true })
        );
        target.dispatchEvent(
          new DragEvent('drop', { dataTransfer, bubbles: true, cancelable: true })
        );

        input.remove();
      }, inputId);
    } catch (e) {
      if (options.isFolder) {
        // webkitdirectory が未対応の環境等への安全策
        console.warn('Directory drop simulation skipped or failed:', e);
      } else {
        throw e;
      }
    } finally {
      // 例外時も含め確実にお掃除する
      await this.page.evaluate((id) => document.getElementById(id)?.remove(), inputId);
    }
  }
}
