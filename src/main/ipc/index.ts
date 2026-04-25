import { registerFlacHandlers } from './flac-handlers';
import { initializeEventForwarding } from './event-forwarder';
import { registerPlatformHandlers } from './platform-handlers';

/**
 * IPC関連の設定（ハンドラー登録およびイベント転送）を初期化します。
 */
export const initializeIpc = (): void => {
  registerPlatformHandlers();
  registerFlacHandlers();
  initializeEventForwarding();
};
