/**
 * 実行環境が Mac (macOS) かどうかを管理します。
 * アプリケーションの初期化時に一度だけ設定されます。
 */
export let IS_MAC = false;

/**
 * プラットフォーム情報を初期化します。
 */
export const initPlatform = async (): Promise<void> => {
  const platform = await window.api.getPlatform();
  IS_MAC = platform === 'darwin';
};
