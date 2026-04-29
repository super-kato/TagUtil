import { type Locator, type Page } from '@playwright/test';

export class ToolbarArea {
  constructor(private readonly page: Page) {}

  get root(): Locator {
    return this.page.locator('header.toolbar');
  }

  /** ディレクトリを開くボタン */
  get openDirectoryButton(): Locator {
    return this.root.locator('button[title="Open Directory"]');
  }

  /** 名前変更を実行するボタン */
  get renameFilesButton(): Locator {
    return this.root.locator('button[title="Rename Files from Metadata"]');
  }

  /** 変更を元に戻すボタン */
  get revertChangesButton(): Locator {
    return this.root.locator('button[title="Revert Changes"]');
  }

  /** 変更を保存するボタン */
  get saveChangesButton(): Locator {
    return this.root.locator('button[title="Save Changes"]');
  }

  /** 設定を開くボタン */
  get settingsButton(): Locator {
    return this.root.locator('button[title="Settings"]');
  }
}
