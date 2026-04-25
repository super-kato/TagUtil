import { type Platform } from '@shared/platform';

/**
 * 現在の実行環境のプラットフォームを取得します。
 */
export const getPlatform = (): Platform => {
  return {
    isMac: process.platform === 'darwin',
    isWindows: process.platform === 'win32'
  };
};
