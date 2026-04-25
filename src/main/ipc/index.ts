import { registerFlacHandlers } from './flac-handlers';
import { registerPlatformHandlers } from './platform-handlers';

/**
 * すべてのIPCハンドラーを一括登録します。
 */
export const registerIpcHandlers = (): void => {
  registerPlatformHandlers();
  registerFlacHandlers();
};
