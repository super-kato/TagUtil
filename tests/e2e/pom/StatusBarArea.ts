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

  async toggleLogPanel(): Promise<void> {
    await this.toggleLogs();
  }

  async isExpanded(): Promise<boolean> {
    return (await this.root.getAttribute('class'))?.includes('expanded') ?? false;
  }

  async getLogs(): Promise<string[]> {
    const entries = this.logPanel.locator('.log-entry');
    const logs: string[] = [];
    const count = await entries.count();
    for (let i = 0; i < count; i++) {
      const entry = entries.nth(i);
      const context = await entry.locator('.log-context').innerText();
      const message = await entry.locator('.log-text').innerText();
      logs.push(`${context} ${message}`);
    }
    return logs;
  }
}
