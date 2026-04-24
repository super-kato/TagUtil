import { type PlatformInfo } from '@shared/platform';

/**
 * 実行環境（プラットフォーム）に関する情報を取得します。
 * Electron の IPC 通信を使用して情報を取得します。
 */
export const getPlatformInfo = async (): Promise<PlatformInfo> => {
  return await window.api.getPlatform();
};
