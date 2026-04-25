import type { LogMessage } from '@domain/common/log';

/**
 * アプリケーションのログメッセージの受信を管理するリポジトリ。
 */
export const logRepository = {
  /**
   * ログメッセージを受信した時のコールバックを登録します。
   * @param callback ログメッセージを受け取るコールバック
   * @returns 登録解除用の関数
   */
  subscribe: (callback: (message: LogMessage) => void): (() => void) => {
    return window.api.onLogMessage(callback);
  }
} as const;
