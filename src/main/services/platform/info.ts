import { type PlatformInfo } from '@shared/platform';

/**
 * 現在の実行環境のプラットフォーム情報を取得します。
 */
export const getPlatformInfo = (): PlatformInfo => {
  return {
    isMac: process.platform === 'darwin'
  };
};
