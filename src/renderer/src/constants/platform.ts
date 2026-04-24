import { PlatformAdapter } from '@renderer/infrastructure/platform-adapter';

/**
 * アプリケーションが macOS 上で動作しているかどうか。
 * 初期化前は false です。初期化には initializePlatform() を呼び出す必要があります。
 */
export let IS_MAC = false;

/**
 * プラットフォーム情報を初期化します。
 * 外部環境から情報を取得するため、非同期で実行されます。
 *
 * @param adapter プラットフォーム情報を取得するためのアダプター。デフォルトは PlatformAdapter。
 */
export const initializePlatform = async (
  adapter: PlatformAdapter = new PlatformAdapter()
): Promise<void> => {
  IS_MAC = await adapter.isMac();
};
