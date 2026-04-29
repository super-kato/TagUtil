import { type Page } from '@playwright/test';
import { join } from 'path';
import { SCREENSHOT_DIR } from '../constants';

/**
 * メイン画面の Page Object Model
 */
export class MainPage {
  constructor(private readonly page: Page) {}

  /**
   * ウィンドウのタイトルを取得する
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * スクリーンショットを撮影する
   * @param fileName 拡張子を除いたファイル名
   */
  async screenshot(fileName: string): Promise<void> {
    const path = join(SCREENSHOT_DIR, `${fileName}.png`);
    await this.page.screenshot({ path });
  }
}
