import { type Locator, type Page } from '@playwright/test';

export class StatusBarArea {
  readonly root: Locator;
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    this.root = page.getByRole('contentinfo');
  }

  /** ログの展開/折りたたみボタン（メインバー全体） */
  get mainBar(): Locator {
    return this.root.getByRole('button', { name: /logs/i });
  }

  /** ログパネルの開閉を切り替えます */
  async toggleLogPanel(): Promise<void> {
    await this.mainBar.click();
    // スライドCSSアニメーションの完了を待機
    await this.page.waitForTimeout(500);
  }

  /** ログパネルが展開されているか確認します */
  async isExpanded(): Promise<boolean> {
    const classAttr = await this.root.getAttribute('class');
    return classAttr?.includes('expanded') ?? false;
  }

  /** 展開されていなければパネルを開きます */
  async ensureExpanded(): Promise<void> {
    if (!(await this.isExpanded())) {
      await this.toggleLogPanel();
    }
  }

  /** 表示されているすべてのログを取得します */
  async getLogs(): Promise<string[]> {
    // 展開されていることを確認
    await this.ensureExpanded();

    const logEntries = this.root.locator('.log-entry');
    const count = await logEntries.count();
    const logs: string[] = [];

    for (let i = 0; i < count; i++) {
      const entry = logEntries.nth(i);
      // コンテキストを取得 (大括弧を外す)
      const context = (await entry.locator('.log-context').innerText()).replace(/[[\]]/g, '');
      // メッセージを取得
      const text = await entry.locator('.log-text').innerText();
      logs.push(`${context}: ${text}`.trim());
    }
    return logs;
  }
}
