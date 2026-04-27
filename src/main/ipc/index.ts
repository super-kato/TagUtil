import { registerFlacHandlers } from './flac-handlers';
import { initializeEventForwarding } from './event-forwarder';
import { registerPlatformHandlers } from './platform-handlers';
import { registerSettingsHandlers } from './settings-handlers';
import { registerWindowHandlers } from './window-handlers';

/**
 * IPC関連の設定（ハンドラー登録およびイベント転送）を初期化します。
 */
export const initializeIpc = (): void => {
  registerPlatformHandlers();
  registerFlacHandlers();
  registerSettingsHandlers();
  registerWindowHandlers();
  initializeEventForwarding();
};
