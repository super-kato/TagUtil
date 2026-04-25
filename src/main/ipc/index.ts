import { registerFlacHandlers } from './flac-handlers';
import { registerPlatformHandlers } from './platform-handlers';
import { startLogForwarding } from './log-forwarder';

/**
 * すべてのIPCハンドラーを一括登録します。
 */
export const registerIpcHandlers = (): void => {
  registerPlatformHandlers();
  registerFlacHandlers();

  // ログメッセージの転送を開始
  startLogForwarding();
};
