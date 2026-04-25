import { EventEmitter } from 'node:events';
import { format } from 'node:util';
import { LogLevel, LogHandler, createLogMessage } from '@domain/common/log';
import { formatLogTime } from '@shared/utils/date';

/**
 * アプリケーション全体のログ管理を行うクラス。
 * EventEmitter を継承し、ログ出力時にイベントを発火させます。
 * クラス自体は非公開とし、シングルトンインスタンスのみを公開します。
 */
class Logger extends EventEmitter {
  static readonly #LOG_EVENT = 'log';

  public info(message: string, ...args: unknown[]): void {
    this.#log('INFO', message, ...args);
  }

  public warn(message: string, ...args: unknown[]): void {
    this.#log('WARN', message, ...args);
  }

  public error(message: string, ...args: unknown[]): void {
    this.#log('ERROR', message, ...args);
  }

  /**
   * ログイベントのリスナーを登録します。
   * イベント名を隠蔽し、型安全な購読を提供します。
   */
  public onLog(handler: LogHandler): void {
    this.on(Logger.#LOG_EVENT, handler);
  }

  /**
   * ログを出力し、イベントを発火させます。
   * @param level ログレベル
   * @param message メッセージ
   * @param args 追加の引数
   */
  #log(level: LogLevel, message: string, ...args: unknown[]): void {
    const formattedMessage = format(message, ...args);
    const logMessage = createLogMessage(level, formattedMessage);
    this.emit(Logger.#LOG_EVENT, logMessage);

    // 標準出力にも出す
    const timestamp = formatLogTime(logMessage.timestamp);
    console.log(`[${timestamp}] [${level}] ${formattedMessage}`);
  }
}

/**
 * Logger のシングルトンインスタンス。
 */
export const logger = new Logger();
