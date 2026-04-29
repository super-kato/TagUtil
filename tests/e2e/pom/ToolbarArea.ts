import { type Locator, type Page } from '@playwright/test';

export class ToolbarArea {
  private readonly root: Locator;

  constructor(private readonly page: Page) {
    this.root = this.page.locator('header.toolbar');
  }

  /** ディレクトリを開くボタン */
  get openDirectoryButton(): Locator {
    return this.root.getByRole('button', { name: 'Open Directory' });
  }

  /** 名前変更を実行するボタン */
  get renameFilesButton(): Locator {
    return this.root.getByRole('button', { name: 'Rename Files from Metadata' });
  }

  /** 変更を元に戻すボタン */
  get revertChangesButton(): Locator {
    return this.root.getByRole('button', { name: 'Revert Changes' });
  }

  /** 変更を保存するボタン */
  get saveChangesButton(): Locator {
    return this.root.getByRole('button', { name: 'Save Changes' });
  }

  /** 設定を開くボタン */
  get settingsButton(): Locator {
    return this.root.getByRole('button', { name: 'Settings' });
  }
}
