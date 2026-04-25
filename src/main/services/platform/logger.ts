import { EventEmitter } from 'node:events';
import { LogMessage, LogLevel, LogHandler } from '@domain/common/log';
import { generateId } from '@main/utils/crypto';

/**
 * アプリケーション全体のログ管理を行うクラス。
 * EventEmitter を継承し、ログ出力時にイベントを発火させます。
 * クラス自体は非公開とし、シングルトンインスタンスのみを公開します。
 */
class Logger extends EventEmitter {
  static readonly #LOG_EVENT = 'log';

  /**
   * ログを出力し、イベントを発火させます。
   * @param level ログレベル
   * @param message メッセージ
   */
  #log(level: LogLevel, message: string): void {
    const logMessage: LogMessage = {
      id: generateId(),
      level,
      message,
      timestamp: Date.now()
    };
    this.emit(Logger.#LOG_EVENT, logMessage);

    // 標準出力にも出す
    const timestamp = new Date(logMessage.timestamp).toISOString();
    console.log(`[${timestamp}] [${level}] ${message}`);
  }

  public info(message: string): void {
    this.#log('INFO', message);
  }

  public warn(message: string): void {
    this.#log('WARN', message);
  }

  public error(message: string): void {
    this.#log('ERROR', message);
  }

  /**
   * ログイベントのリスナーを登録します。
   * イベント名を隠蔽し、型安全な購読を提供します。
   */
  public onLog(handler: LogHandler): void {
    this.on(Logger.#LOG_EVENT, handler);
  }
}

/**
 * Logger のシングルトンインスタンス。
 */
export const logger = new Logger();
