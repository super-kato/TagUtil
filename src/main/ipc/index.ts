import { registerFlacHandlers } from './flac-handlers';
import { startLogForwarding } from './log-forwarder';
import { registerPlatformHandlers } from './platform-handlers';

/**
 * IPC関連の設定（ハンドラー登録およびログ転送）を初期化します。
 */
export const initializeIpc = (): void => {
  registerPlatformHandlers();
  registerFlacHandlers();
  startLogForwarding();
};
