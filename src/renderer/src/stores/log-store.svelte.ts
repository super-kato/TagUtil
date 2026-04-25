import type { LogMessage } from '@domain/common/log';

/**
 * レンダラープロセス側のログを保持するストア。
 * 最新100件までのログを保持します。
 */
class LogStore {
  private logEntries = $state<LogMessage[]>([]);
  private readonly MAX_LOGS = 100;

  /** 保持しているログのリスト */
  get logs(): LogMessage[] {
    return this.logEntries;
  }

  /** 最新のログ */
  get latestLog(): LogMessage | undefined {
    return this.logEntries[this.logEntries.length - 1];
  }

  /**
   * ログを追加します。上限を超えた場合は古いものから削除されます。
   * @param log ログメッセージ
   */
  addLog(log: LogMessage): void {
    this.logEntries.push(log);
    if (this.logEntries.length > this.MAX_LOGS) {
      this.logEntries.shift();
    }
  }

  /**
   * 全てのログをクリアします。
   */
  clear(): void {
    this.logEntries = [];
  }
}

export const logStore = new LogStore();
