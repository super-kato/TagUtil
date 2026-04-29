import { test as base, _electron as electron, type ElectronApplication } from '@playwright/test';
import electronPath from 'electron';
import { resolve, join } from 'path';
import { tmpdir } from 'os';
import { mkdirSync, copyFileSync, rmSync, readdirSync } from 'fs';
import { MainPage } from './pom/MainPage';

// Fixture の型定義
type AppFixtures = {
  electronApp: ElectronApplication;
  mainPage: MainPage;
  testDataDir: string;
};

/**
 * カスタム fixture を追加した E2E テスト用オブジェクト
 */
export const e2eTest = base.extend<AppFixtures>({
  // Playwrightのフィクスチャ定義で空のパターンが必要なため、ESLintの警告を抑制
  // eslint-disable-next-line no-empty-pattern
  electronApp: async ({}, use) => {
    const app = await electron.launch({
      args: [resolve('out/main/index.js')],
      // Node.js環境ではelectronパッケージは実行パスの文字列を返すため、型不一致を許容する
      // @ts-expect-error - electronPath is a string at runtime
      executablePath: electronPath,
      env: {
        ...process.env,
        CI: 'true' // テスト環境であることを示す
      }
    });
    await use(app);
    await app.close();
  },

  mainPage: [
    async ({ electronApp }, use, testInfo) => {
      const window = await electronApp.firstWindow();
      // テストファイルパスを渡して、スペックごとにフォルダを分けるようにする
      await use(new MainPage(window, testInfo.file));
    },
    { auto: true }
  ],

  /**
   * テストごとに独立した一時ディレクトリを作成し、フィクスチャをコピーして提供します。
   * テスト終了後に自動的に削除されます。
   */
  // eslint-disable-next-line no-empty-pattern
  testDataDir: async ({}, use) => {
    const baseFixturesDir = resolve(process.cwd(), 'tests/e2e/fixtures');
    const tempDir = join(tmpdir(), `tagutil-e2e-${Math.random().toString(36).slice(2)}`);

    mkdirSync(tempDir, { recursive: true });

    // fixtures ディレクトリ内のファイルをすべてコピー
    const files = readdirSync(baseFixturesDir);
    for (const file of files) {
      const src = join(baseFixturesDir, file);
      const dest = join(tempDir, file);
      // ディレクトリは無視（今のところファイルのみ想定）
      try {
        copyFileSync(src, dest);
      } catch (e) {
        console.warn(`Failed to copy fixture ${file}:`, e);
      }
    }

    await use(tempDir);

    // テスト終了後のクリーンアップ
    try {
      rmSync(tempDir, { recursive: true, force: true });
    } catch (e) {
      console.warn(`Failed to cleanup tempDir ${tempDir}:`, e);
    }
  }
});

export { expect } from '@playwright/test';
