import { type Locator, type Page } from '@playwright/test';

export class InspectorArea {
  readonly root: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    this.root = page.locator('aside.inspector');
    this.emptyState = this.root.locator('.empty-inspector');
  }

  async isEditingEnabled(): Promise<boolean> {
    return await this.emptyState.isHidden();
  }
}
