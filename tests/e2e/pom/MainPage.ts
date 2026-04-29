import { type Page } from '@playwright/test';
import { join } from 'path';
import { SCREENSHOT_DIR } from '../constants';
import { InspectorArea } from './InspectorArea';
import { StatusBarArea } from './StatusBarArea';
import { ToolbarArea } from './ToolbarArea';
import { TrackGridArea } from './TrackGridArea';

/**
 * メイン画面の Page Object Model
 */
export class MainPage {
  readonly toolbar: ToolbarArea;
  readonly trackGrid: TrackGridArea;
  readonly inspector: InspectorArea;
  readonly statusBar: StatusBarArea;

  constructor(private readonly page: Page) {
    this.toolbar = new ToolbarArea(page);
    this.trackGrid = new TrackGridArea(page);
    this.inspector = new InspectorArea(page);
    this.statusBar = new StatusBarArea(page);
  }

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
    // CI環境などでウィンドウサイズが確定する前に撮影しようとするとエラーになるため、サイズが確定するまで待機する
    await this.page.waitForFunction(() => window.innerWidth > 0);

    const path = join(SCREENSHOT_DIR, `${fileName}.png`);
    await this.page.screenshot({ path });
  }
}
