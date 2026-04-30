import { type Locator, type Page } from '@playwright/test';

export class GenreSection {
  readonly genreInput: Locator;

  constructor(
    public readonly page: Page,
    public readonly root: Locator
  ) {
    this.genreInput = this.root.getByLabel('Genre', { exact: true });
  }

  async setGenres(values: string[]): Promise<void> {
    const container = this.root.getByTestId('genre-field');
    await container.scrollIntoViewIfNeeded();

    const removeButtons = container.locator('button.remove-btn');
    let count = await removeButtons.count();
    while (count > 0) {
      await removeButtons.first().click({ force: true });
      await this.page.waitForTimeout(100);
      count = await removeButtons.count();
    }

    const input = container.locator('input[type="text"]');
    for (const value of values) {
      await input.scrollIntoViewIfNeeded();
      await input.fill(value);
      await input.press('Enter');
      await this.page.waitForTimeout(100);
    }
  }

  async getGenres(): Promise<string[]> {
    const container = this.root.getByTestId('genre-field');
    await container.scrollIntoViewIfNeeded();
    await container.waitFor({ state: 'visible', timeout: 10000 });
    return await container
      .getByTestId('badge-item')
      .evaluateAll((nodes) =>
        nodes.map((node) => (node.firstChild as Text)?.textContent?.trim() || '')
      );
  }
}
