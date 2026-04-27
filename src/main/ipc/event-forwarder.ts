import { windowAdapter } from '@main/infrastructure/platform/window-adapter';
import { logger } from '@main/infrastructure/logging/logger';
import { IPC_CHANNELS } from '@shared/ipc';

/**
 * メインプロセスからレンダラープロセス（ウィンドウ）へのイベント転送を初期化します。
 * ログイベントやシステム通知など、メイン側で発生した事象をアクティブな全ウィンドウへプッシュします。
 */
export const initializeEventForwarding = (): void => {
  // ログイベントの転送
  logger.onLog((logMessage) => {
    windowAdapter.sendToAllWindows(IPC_CHANNELS.ON_LOG, logMessage);
  });
};
