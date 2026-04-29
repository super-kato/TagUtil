import { test as base, _electron as electron, type ElectronApplication } from '@playwright/test';
import electronPath from 'electron';
import { resolve } from 'path';
import { MainPage } from './pom/MainPage';

// Fixture の型定義
type AppFixtures = {
  electronApp: ElectronApplication;
  mainPage: MainPage;
};

/**
 * カスタム fixture を追加した E2E テスト用オブジェクト
 * 標準の test との混同を避けるため e2eTest として定義
 */
export const e2eTest = base.extend<AppFixtures>({
  // eslint-disable-next-line no-empty-pattern
  electronApp: async ({}, use) => {
    const app = await electron.launch({
      args: [resolve('out/main/index.js')],
      // @ts-expect-error - Node.js環境ではelectronパッケージは実行パスの文字列を返すため、型不一致を許容する
      executablePath: electronPath
    });
    await use(app);
    await app.close();
  },
  mainPage: [
    async ({ electronApp }, use) => {
      const window = await electronApp.firstWindow();
      await use(new MainPage(window));
    },
    { auto: true }
  ]
});

export { expect } from '@playwright/test';
