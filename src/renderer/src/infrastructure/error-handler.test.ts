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

  it('window.onerror が呼ばれた際に logStore.addError が呼び出されること', () => {
    const message = 'Test error';
    const source = 'test.js';
    const lineno = 10;
    const colno = 5;
    const error = new Error('Test error object');
    error.stack = 'stack trace';

    if (window.onerror) {
      window.onerror(message, source, lineno, colno, error);
    }

    expect(logStore.addError).toHaveBeenCalledWith('Uncaught Exception', 'stack trace');
  });

  it('window.onerror がエラーオブジェクトなしで呼ばれた場合も適切にフォーマットされること', () => {
    const message = 'Test error without object';
    const source = 'test.js';
    const lineno = 10;
    const colno = 5;

    if (window.onerror) {
      window.onerror(message, source, lineno, colno, undefined);
    }

    expect(logStore.addError).toHaveBeenCalledWith(
      'Uncaught Exception',
      'Test error without object (test.js:10:5)'
    );
  });

  it('window.onunhandledrejection が呼ばれた際に logStore.addError が呼び出されること', () => {
    const error = new Error('Promise rejection');
    error.stack = 'promise stack trace';
    const promise = Promise.reject(error);
    promise.catch(() => {}); // テストランナーによる未ハンドルの拒否検出を避けるためにキャッチする
    const event = new PromiseRejectionEvent('unhandledrejection', {
      promise,
      reason: error
    });

    if (window.onunhandledrejection) {
      window.onunhandledrejection(event);
    }

    expect(logStore.addError).toHaveBeenCalledWith('Unhandled Rejection', 'promise stack trace');
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

    expect(logStore.addError).toHaveBeenCalledWith('Unhandled Rejection', 'Something went wrong');
  });
});
