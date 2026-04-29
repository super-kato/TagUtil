import { type Locator, type Page } from '@playwright/test';

export class StatusBarArea {
  readonly root: Locator;
  readonly page: Page;
  readonly logPanelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.root = page.getByTestId('status-bar');
    this.logPanelButton = this.root.getByRole('button', { name: /logs/i });
  }

  async ensureExpanded(): Promise<void> {
    const isExpanded = (await this.root.getAttribute('class'))?.includes('expanded');
    if (!isExpanded) {
      await this.logPanelButton.click();
    }
  }

  async ensureCollapsed(): Promise<void> {
    const isExpanded = (await this.root.getAttribute('class'))?.includes('expanded');
    if (isExpanded) {
      await this.logPanelButton.click();
    }
  }

  async getLogs(): Promise<{ context: string; message: string }[]> {
    const rows = this.root.locator('tr.log-entry');
    const count = await rows.count();
    const logs: { context: string; message: string }[] = [];

    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const context = await row.getByTestId('log-context').innerText();
      const message = await row.getByTestId('log-message').innerText();
      // コンテキストの [] を除去
      logs.push({
        context: context.replace(/^\[|\]$/g, ''),
        message: message.trim()
      });
    }
    return logs;
  }

  async toggleLogPanel(): Promise<void> {
    await this.logPanelButton.click();
  }

  /** ログの展開/折りたたみボタン（メインバー全体） */
  get mainBar(): Locator {
    return this.root.getByRole('button', { name: /logs/i });
  }
}
