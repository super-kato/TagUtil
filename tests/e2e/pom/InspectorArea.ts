import { type Locator, type Page } from '@playwright/test';

export class InspectorArea {
  readonly root: Locator;
  readonly emptyState: Locator;
  readonly titleInput: Locator;

  constructor(page: Page) {
    this.root = page.locator('aside.inspector');
    this.emptyState = this.root.locator('.empty-inspector');
    this.titleInput = this.root.locator('input#title');
  }

  async isEditingEnabled(): Promise<boolean> {
    return await this.emptyState.isHidden();
  }

  async getTitle(): Promise<string> {
    return await this.titleInput.inputValue();
  }

  async setTitle(value: string): Promise<void> {
    await this.titleInput.fill(value);
  }
}
