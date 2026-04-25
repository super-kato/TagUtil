import type { LogHandler } from '@shared/utils/log';

import type { Unsubscribe } from '@shared/types';

/**
 * ログメッセージを受信した時のコールバックを登録します。
 * @param callback ログメッセージを受け取るコールバック
 * @returns 登録解除用の関数
 */
const subscribe = (callback: LogHandler): Unsubscribe => {
  return window.api.onLogMessage(callback);
};

/**
 * アプリケーションのログメッセージの受信を管理するリポジトリ。
 */
export const logRepository = {
  subscribe
} as const;
