import { type Locator, type Page } from '@playwright/test';

export class NumericFieldsSection {
  readonly trackNumberInput: Locator;
  readonly trackTotalInput: Locator;
  readonly discNumberInput: Locator;
  readonly discTotalInput: Locator;
  readonly dateInput: Locator;

  constructor(
    public readonly page: Page,
    public readonly root: Locator
  ) {
    this.trackNumberInput = this.root.getByLabel('Track', { exact: true });
    this.trackTotalInput = this.root.getByPlaceholder('Tracks', { exact: true });
    this.discNumberInput = this.root.getByLabel('Disc', { exact: true });
    this.discTotalInput = this.root.getByPlaceholder('Discs', { exact: true });
    this.dateInput = this.root.getByLabel('Date', { exact: true });
  }

  async setTrackNumber(value: string): Promise<void> {
    await this.fillInput(this.trackNumberInput, value);
  }

  async setTrackTotal(value: string): Promise<void> {
    await this.fillInput(this.trackTotalInput, value);
  }

  async setDiscNumber(value: string): Promise<void> {
    await this.fillInput(this.discNumberInput, value);
  }

  async setDiscTotal(value: string): Promise<void> {
    await this.fillInput(this.discTotalInput, value);
  }

  async setDate(value: string): Promise<void> {
    await this.fillInput(this.dateInput, value);
  }

  private async fillInput(locator: Locator, value: string): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
    await locator.fill(value);
    await locator.press('Enter');
    await this.page.waitForTimeout(100);
  }
}
