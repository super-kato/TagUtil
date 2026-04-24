/**
 * 実行環境（プラットフォーム）に関する情報にアクセスするためのアダプター。
 * Electron の IPC 通信を使用して情報を取得します。
 */
export class PlatformAdapter {
  /**
   * 現在の OS が macOS かどうかを判定します。
   */
  async isMac(): Promise<boolean> {
    if (typeof window === 'undefined' || !window.api) {
      return false;
    }
    const platform = await window.api.getPlatform();
    return platform.isMac;
  }
}
