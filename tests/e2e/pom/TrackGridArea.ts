import { type Locator, type Page } from '@playwright/test';

export class TrackGridArea {
  readonly root: Locator;
  readonly emptyState: Locator;
  readonly openDirectoryButton: Locator;

  constructor(private readonly page: Page) {
    this.root = page.getByTestId('track-grid');
    this.emptyState = page.getByTestId('track-grid-empty');
    this.openDirectoryButton = this.emptyState.getByRole('button', { name: 'Open Directory' });
  }

  get rows(): Locator {
    return this.root.locator('tr.track-row');
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
    return await this.rows.getByTestId('cell-title').allInnerTexts();
  }

  /**
   * 現在表示されているすべてのトラックの「アーティスト」を取得します。
   */
  async getArtists(): Promise<string[]> {
    return await this.rows.getByTestId('cell-artist').allInnerTexts();
  }
}
