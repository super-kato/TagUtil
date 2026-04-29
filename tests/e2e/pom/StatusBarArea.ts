import { type Locator, type Page } from '@playwright/test';

export class StatusBarArea {
  readonly root: Locator;
  readonly toggleButton: Locator;
  readonly logPanel: Locator;

  constructor(page: Page) {
    this.root = page.locator('footer.status-bar');
    this.toggleButton = this.root.locator('.main-bar');
    this.logPanel = this.root.locator('.log-panel');
  }

  async toggleLogs(): Promise<void> {
    await this.toggleButton.click();
  }
}
