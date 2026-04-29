import { type Locator, type Page } from '@playwright/test';

export class ToolbarArea {
  private readonly root: Locator;
  readonly openDirectoryButton: Locator;
  readonly saveChangesButton: Locator;
  readonly renameFilesButton: Locator;
  readonly revertChangesButton: Locator;
  readonly settingsButton: Locator;

  constructor(private readonly page: Page) {
    this.root = this.page.getByTestId('toolbar');
    this.openDirectoryButton = this.root.getByTestId('open-directory-button');
    this.saveChangesButton = this.root.getByTestId('save-changes-button');
    this.renameFilesButton = this.root.getByRole('button', { name: 'Rename Files from Metadata' });
    this.revertChangesButton = this.root.getByRole('button', { name: 'Revert Changes' });
    this.settingsButton = this.root.getByRole('button', { name: 'Settings' });
  }
}
