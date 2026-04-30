import { type Locator, type Page } from '@playwright/test';

export class BasicFieldsSection {
  readonly titleInput: Locator;
  readonly artistInput: Locator;
  readonly albumInput: Locator;
  readonly albumArtistInput: Locator;
  readonly catalogNumberInput: Locator;

  constructor(
    public readonly page: Page,
    public readonly root: Locator
  ) {
    this.titleInput = this.root.getByLabel('Title', { exact: true });
    this.albumInput = this.root.getByLabel('Album', { exact: true });
    this.catalogNumberInput = this.root.getByLabel('Catalog Number', { exact: true });
    this.artistInput = this.root.getByLabel('Artist', { exact: true });
    this.albumArtistInput = this.root.getByLabel('Album Artist', { exact: true });
  }

  async setTitle(value: string): Promise<void> {
    await this.fillInput(this.titleInput, value);
  }

  async setAlbum(value: string): Promise<void> {
    await this.fillInput(this.albumInput, value);
  }

  async setCatalogNumber(value: string): Promise<void> {
    await this.fillInput(this.catalogNumberInput, value);
  }

  async setArtists(values: string[]): Promise<void> {
    await this.setMultiValueField('artist-field', values);
  }

  async setAlbumArtists(values: string[]): Promise<void> {
    await this.setMultiValueField('album-artist-field', values);
  }

  async getArtists(): Promise<string[]> {
    return this.getMultiValueFieldValues('artist-field');
  }

  async getAlbumArtists(): Promise<string[]> {
    return this.getMultiValueFieldValues('album-artist-field');
  }

  private async fillInput(locator: Locator, value: string): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
    await locator.fill(value);
    await locator.press('Enter');
    await this.page.waitForTimeout(100);
  }

  private async setMultiValueField(testId: string, values: string[]): Promise<void> {
    const container = this.root.getByTestId(testId);
    await container.scrollIntoViewIfNeeded();

    const removeButtons = container.locator('button.remove-button');
    let count = await removeButtons.count();
    while (count > 0) {
      await removeButtons.first().click({ force: true });
      await this.page.waitForTimeout(100);
      count = await removeButtons.count();
    }

    const addButton = container.getByTitle('Add value');
    for (const value of values) {
      await addButton.scrollIntoViewIfNeeded();
      await addButton.click({ force: true });
      await this.page.waitForTimeout(100);
      const lastInput = container.locator('input[type="text"]').last();
      await lastInput.scrollIntoViewIfNeeded();
      await lastInput.fill(value);
      await lastInput.press('Enter');
      await this.page.waitForTimeout(100);
    }
  }

  private async getMultiValueFieldValues(testId: string): Promise<string[]> {
    const container = this.root.getByTestId(testId);
    await container.scrollIntoViewIfNeeded();
    await container.waitFor({ state: 'visible', timeout: 10000 });
    const inputs = container.locator('input[type="text"]');
    return inputs.evaluateAll((elems) => elems.map((el) => (el as HTMLInputElement).value));
  }
}
