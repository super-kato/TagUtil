import { type Locator, type Page } from '@playwright/test';

export class ArtworkSection {
  readonly coverArt: Locator;
  readonly coverPlaceholder: Locator;
  readonly coverPlaceholderText: Locator;

  constructor(
    public readonly page: Page,
    public readonly root: Locator
  ) {
    this.coverArt = this.root.getByTestId('cover-art');
    this.coverPlaceholder = this.root.getByTestId('cover-placeholder');
    this.coverPlaceholderText = this.root.getByTestId('cover-placeholder-text');
  }
}
