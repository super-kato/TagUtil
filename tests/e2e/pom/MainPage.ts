import { type Page } from '@playwright/test';
import { ToolbarArea } from './ToolbarArea';
import { TrackGridArea } from './TrackGridArea';
import { InspectorArea } from './InspectorArea';
import { StatusBarArea } from './StatusBarArea';
import { join, basename, extname } from 'path';
import { mkdirSync } from 'fs';

export class MainPage {
  readonly toolbar: ToolbarArea;
  readonly trackGrid: TrackGridArea;
  readonly inspector: InspectorArea;
  readonly statusBar: StatusBarArea;
  private readonly screenshotDir: string;

  constructor(
    public readonly page: Page,
    testFilePath: string
  ) {
    this.toolbar = new ToolbarArea(page);
    this.trackGrid = new TrackGridArea(page);
    this.inspector = new InspectorArea(page);
    this.statusBar = new StatusBarArea(page);

    // スペックファイル名（拡張子なし）をフォルダ名にする
    const specName = basename(testFilePath, extname(testFilePath));
    this.screenshotDir = join(process.cwd(), 'tests/e2e/screenshots', specName);

    // フォルダの作成を保証
    mkdirSync(this.screenshotDir, { recursive: true });
  }

  /**
   * 指定した名前でスクリーンショットを保存します。
   * スペックファイルごとに作成された専用フォルダ内に保存されます。
   * @param name ファイル名 (例: '01_起動直後')
   */
  async screenshot(name: string): Promise<void> {
    const filename = name.endsWith('.png') ? name : `${name}.png`;
    const fullPath = join(this.screenshotDir, filename);

    await this.page.screenshot({
      path: fullPath,
      fullPage: true
    });
  }
}
