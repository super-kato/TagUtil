import { type Locator, type Page } from '@playwright/test';

export class TrackGridArea {
  readonly root: Locator;
  readonly emptyState: Locator;
  readonly openDirectoryButton: Locator;
  readonly rows: Locator;

  constructor(page: Page) {
    this.root = page.locator('.grid-wrapper');
    this.emptyState = this.root.locator('.empty-state');
    this.openDirectoryButton = this.emptyState.getByRole('button', { name: 'Open Directory' });
    this.rows = this.root.locator('tr.track-row');
  }

  async getTrackCount(): Promise<number> {
    return await this.rows.count();
  }

  async selectTrack(index: number): Promise<void> {
    await this.rows.nth(index).click();
  }

  /**
   * 現在表示されているすべてのトラックのタイトルを取得します。
   */
  async getTitles(): Promise<string[]> {
    return await this.rows.locator('td.text-cell').first().allInnerTexts();
  }

  /**
   * 現在表示されているすべてのトラックの「アーティスト」を取得します。
   */
  async getArtists(): Promise<string[]> {
    return await this.rows.locator('td.text-cell').nth(1).allInnerTexts();
  }

  /**
   * 行が選択されているか確認します。
   */
  async isSelected(index: number): Promise<boolean> {
    const row = this.rows.nth(index);
    const ariaSelected = await row.getAttribute('aria-selected');
    return (
      ariaSelected === 'true' || (await row.evaluate((el) => el.classList.contains('selected')))
    );
  }
}
