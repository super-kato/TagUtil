import { type Platform } from '@shared/platform';

/**
 * 実行環境（プラットフォーム）を取得します。
 * Electron の IPC 通信を使用して情報を取得します。
 */
export const getPlatform = async (): Promise<Platform> => {
  return await window.api.getPlatform();
};
