/** @vitest-environment jsdom */
import { logStore } from '@renderer/stores/log-store.svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initializeGlobalErrorHandler } from './error-handler';

vi.mock('@renderer/stores/log-store.svelte', () => ({
  logStore: {
    addError: vi.fn()
  }
}));

describe('error-handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    initializeGlobalErrorHandler();
  });

  afterEach(() => {
    // グローバルハンドラーをクリーンアップ（テスト間の干渉を防ぐ）
    window.onerror = null;
    window.onunhandledrejection = null;
  });

  it('window.onerror が呼ばれたとき、エラーメッセージをログに記録すること', () => {
    const message = 'Test error';
    const handler = window.onerror;
    if (handler) {
      handler(message, 'source.js', 1, 1);
    }

    expect(logStore.addError).toHaveBeenCalledWith({
      context: 'Uncaught Exception',
      message: 'Test error'
    });
  });

  it('Errorオブジェクトを伴う window.onerror が呼ばれたとき、そのメッセージを記録すること', () => {
    const error = new Error('Complex error');
    const handler = window.onerror;
    if (handler) {
      handler('Complex error', 'source.js', 1, 1, error);
    }

    expect(logStore.addError).toHaveBeenCalledWith({
      context: 'Uncaught Exception',
      message: 'Complex error'
    });
  });

  it('window.onunhandledrejection が呼ばれたとき、エラーメッセージを記録すること', () => {
    const error = new Error('Async error');
    const promise = Promise.reject(error);
    promise.catch(() => {}); // テストランナーによる未ハンドルの拒否検出を避ける

    const event = new PromiseRejectionEvent('unhandledrejection', {
      promise,
      reason: error
    });

    if (window.onunhandledrejection) {
      window.onunhandledrejection(event);
    }

    expect(logStore.addError).toHaveBeenCalledWith({
      context: 'Unhandled Rejection',
      message: 'Async error'
    });
  });

  it('window.onunhandledrejection が Error 以外の理由で呼ばれた場合も適切に記録されること', () => {
    const reason = 'Something went wrong';
    const promise = Promise.reject(reason);
    promise.catch(() => {}); // テストランナーによる未ハンドルの拒否検出を避けるためにキャッチする
    const event = new PromiseRejectionEvent('unhandledrejection', {
      promise,
      reason: reason
    });

    if (window.onunhandledrejection) {
      window.onunhandledrejection(event);
    }

    expect(logStore.addError).toHaveBeenCalledWith({
      context: 'Unhandled Rejection',
      message: 'Something went wrong'
    });
  });
});
