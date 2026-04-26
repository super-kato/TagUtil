import { logStore } from '@renderer/stores/log-store.svelte';

/**
 * レンダラープロセス側のグローバルエラーハンドラーを初期化します。
 * 未キャッチの例外やPromiseの拒否をトラップし、ログストアに記録します。
 */
export const initializeGlobalErrorHandler = (): void => {
  window.onerror = (message, source, lineno, colno, error): void => {
    const errorMsg = error?.stack || `${message} (${source}:${lineno}:${colno})`;
    logStore.addError({ context: 'Uncaught Exception', message: errorMsg });
  };

  window.onunhandledrejection = (event: PromiseRejectionEvent): void => {
    const reason = event.reason;
    const errorMsg = reason instanceof Error ? (reason.stack ?? reason.message) : String(reason);
    logStore.addError({ context: 'Unhandled Rejection', message: errorMsg });
  };
};
