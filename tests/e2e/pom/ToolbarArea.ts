import { type Locator, type Page } from '@playwright/test';

export class ToolbarArea {
  readonly root: Locator;
  readonly openDirectoryButton: Locator;
  readonly renameFilesButton: Locator;
  readonly revertChangesButton: Locator;
  readonly saveChangesButton: Locator;
  readonly settingsButton: Locator;

  constructor(page: Page) {
    this.root = page.locator('header.toolbar');
    this.openDirectoryButton = this.root.locator('button[title="Open Directory"]');
    this.renameFilesButton = this.root.locator('button[title="Rename Files from Metadata"]');
    this.revertChangesButton = this.root.locator('button[title="Revert Changes"]');
    this.saveChangesButton = this.root.locator('button[title="Save Changes"]');
    this.settingsButton = this.root.locator('button[title="Settings"]');
  }
}
