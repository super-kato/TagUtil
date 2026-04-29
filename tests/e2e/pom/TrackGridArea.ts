import { type Locator, type Page } from '@playwright/test';

export class TrackGridArea {
  readonly root: Locator;
  readonly emptyState: Locator;
  readonly openDirectoryButton: Locator;
  readonly rows: Locator;

  constructor(page: Page) {
    this.root = page.locator('.grid-wrapper');
    this.emptyState = this.root.locator('.empty-state');
    this.openDirectoryButton = this.emptyState.locator('button[aria-label="Open Directory"]');
    this.rows = this.root.locator('tr.track-row');
  }

  async getTrackCount(): Promise<number> {
    return await this.rows.count();
  }

  async selectTrack(index: number): Promise<void> {
    await this.rows.nth(index).click();
  }

  async getTrackTitle(index: number): Promise<string> {
    // 3番目のセル（インジケーター、トラック番号の次）がタイトル
    return await this.rows.nth(index).locator('td.text-cell').first().innerText();
  }
}
