import { createLogMessage, type LogMessage, type LogParams } from '@domain/common/log';

const DEFAULT_MAX_LOGS = 100;

/** ログ追加時のオプション（レベルを除くパラメータ） */
type LogOptions = Omit<LogParams, 'level'>;

/**
 * レンダラープロセス側のログを保持するストア。
 * 最新100件までのログを保持します。
 */
class LogStore {
  #logEntries = $state<LogMessage[]>([]);
  #MAX_LOGS = DEFAULT_MAX_LOGS;

  /** 保持しているログのリスト */
  get logs(): LogMessage[] {
    return this.#logEntries;
  }

  /** 最新のログ */
  get latestLog(): LogMessage | undefined {
    return this.#logEntries[this.#logEntries.length - 1];
  }

  /**
   * ログを追加します。上限を超えた場合は古いものから削除されます。
   * @param log ログメッセージ
   */
  addLog(log: LogMessage): void {
    this.#logEntries.push(log);
    if (this.#logEntries.length > this.#MAX_LOGS) {
      this.#logEntries.shift();
    }
  }

  /**
   * エラーログを追加します。
   * @param options ログオプション
   */
  addError(options: LogOptions): void {
    this.addLog(createLogMessage({ ...options, level: 'ERROR' }));
  }

  /**
   * 警告ログを追加します。
   * @param options ログオプション
   */
  addWarn(options: LogOptions): void {
    this.addLog(createLogMessage({ ...options, level: 'WARN' }));
  }
}

/**
 * LogStore のシングルトンインスタンス。
 */
export const logStore = new LogStore();
