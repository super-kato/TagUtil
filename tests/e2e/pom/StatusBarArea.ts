import { type Locator, type Page } from '@playwright/test';

export class StatusBarArea {
  readonly root: Locator;
  readonly toggleButton: Locator;

  constructor(public readonly page: Page) {
    this.root = page.getByTestId('status-bar');
    this.toggleButton = this.root.getByRole('button', { name: /logs$/i });
  }
}
