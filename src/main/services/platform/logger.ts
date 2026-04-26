import { EventEmitter } from 'node:events';
import { LogLevel, LogHandler, createLogMessage } from '@domain/common/log';
import { formatLogTime } from '@shared/utils/date';

/**
 * アプリケーション全体のログ管理を行うクラス。
 * EventEmitter を継承し、ログ出力時にイベントを発火させます。
 * クラス自体は非公開とし、シングルトンインスタンスのみを公開します。
 */
class Logger extends EventEmitter {
  static readonly #LOG_EVENT = 'log';

  public info(message: string, context?: string): void {
    this.#log('INFO', message, context);
  }

  public warn(message: string, context?: string): void {
    this.#log('WARN', message, context);
  }

  public error(message: string, context?: string): void {
    this.#log('ERROR', message, context);
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
   * @param context コンテキスト
   */
  #log(level: LogLevel, message: string, context?: string): void {
    const logMessage = createLogMessage(level, message, context);
    this.emit(Logger.#LOG_EVENT, logMessage);

    // 標準出力にも出す
    const timestamp = formatLogTime(logMessage.timestamp);
    const contextPart = context ? ` [${context}]` : '';
    console.log(`[${timestamp}] [${level}]${contextPart} ${message}`);
  }
}

/**
 * Logger のシングルトンインスタンス。
 */
export const logger = new Logger();
