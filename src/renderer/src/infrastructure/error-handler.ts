import { logStore } from '@renderer/stores/log-store.svelte';

/**
 * レンダラープロセス側のグローバルエラーハンドラーを初期化します。
 * 未キャッチの例外やPromiseの拒否をトラップし、ログストアに記録します。
 */
export const initializeGlobalErrorHandler = (): void => {
  window.onerror = (message, _source, _lineno, _colno, error): void => {
    const errorMsg = error instanceof Error ? error.message : String(message);
    logStore.addError({ context: 'Uncaught Exception', message: errorMsg });
  };

  window.onunhandledrejection = (event: PromiseRejectionEvent): void => {
    const reason = event.reason;
    const errorMsg = reason instanceof Error ? reason.message : String(reason);
    logStore.addError({ context: 'Unhandled Rejection', message: errorMsg });
  };
};
