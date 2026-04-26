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

  public info(context: string, message: string, ...args: unknown[]): void {
    this.#log('INFO', context, message, ...args);
  }

  public warn(context: string, message: string, ...args: unknown[]): void {
    this.#log('WARN', context, message, ...args);
  }

  public error(context: string, message: string, ...args: unknown[]): void {
    this.#log('ERROR', context, message, ...args);
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
   * @param context コンテキスト
   * @param message メッセージ
   * @param args 追加の引数
   */
  #log(level: LogLevel, context: string, message: string, ...args: unknown[]): void {
    const formattedMessage = format(message, ...args);
    const logMessage = createLogMessage(level, context, formattedMessage);
    this.emit(Logger.#LOG_EVENT, logMessage);

    // 標準出力にも出す
    const timestamp = formatLogTime(logMessage.timestamp);
    console.log(`[${timestamp}] [${level}] [${context}] ${formattedMessage}`);
  }
}

/**
 * Logger のシングルトンインスタンス。
 */
export const logger = new Logger();
