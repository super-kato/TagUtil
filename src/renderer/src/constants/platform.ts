import { getPlatformInfo } from '@renderer/infrastructure/platform-adapter';

let isMacInternal = false;

/**
 * アプリケーションが macOS 上で動作しているかどうか。
 * 初期化前は false です。初期化には initializePlatform() を呼び出す必要があります。
 * 外部からは読み取り専用です。
 */
export { isMacInternal as IS_MAC };

/**
 * プラットフォーム情報を初期化します。
 * 外部環境から情報を取得するため、非同期で実行されます。
 *
 * @param fetchInfo プラットフォーム情報を取得するための関数。デフォルトは getPlatformInfo。
 */
export const initializePlatform = async (fetchInfo = getPlatformInfo): Promise<void> => {
  const info = await fetchInfo();
  isMacInternal = info.isMac;
};
