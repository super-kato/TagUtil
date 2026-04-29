import { type Locator, type Page } from '@playwright/test';

export class ToolbarArea {
  readonly root: Locator;
  readonly openDirectoryButton: Locator;
  readonly saveChangesButton: Locator;
  readonly renameButton: Locator;
  readonly revertButton: Locator;
  readonly settingsButton: Locator;

  constructor(private readonly page: Page) {
    this.root = this.page.getByTestId('toolbar');
    this.openDirectoryButton = this.root.getByTestId('open-directory-button');
    this.saveChangesButton = this.root.getByTestId('save-changes-button');
    this.renameButton = this.root.getByTestId('rename-button');
    this.revertButton = this.root.getByTestId('revert-button');
    this.settingsButton = this.root.getByTestId('settings-button');
  }
}
