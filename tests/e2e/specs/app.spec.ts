import { e2eTest, expect } from '../fixtures';

e2eTest('アプリケーションが起動し、タイトルが正しいこと', async ({ mainPage }) => {
  // タイトルの確認
  expect(await mainPage.getTitle()).toBe('TagUtil');

  // スクリーンショットの撮影（デバッグ用）
  await mainPage.screenshot('initial-load');
});
