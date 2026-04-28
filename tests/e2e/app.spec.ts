import { _electron as electron } from '@playwright/test';
import { test, expect } from '@playwright/test';
import electronPath from 'electron';
import { resolve } from 'path';

test('アプリケーションが起動し、タイトルが正しいこと', async () => {
  const electronApp = await electron.launch({
    args: [resolve('out/main/index.js')],
    executablePath: electronPath as unknown as string
  });

  const window = await electronApp.firstWindow();

  // タイトルの確認
  expect(await window.title()).toBe('TagUtil');

  // スクリーンショットの撮影（デバッグ用）
  await window.screenshot({ path: 'tests/e2e/screenshots/initial-load.png' });

  await electronApp.close();
});
