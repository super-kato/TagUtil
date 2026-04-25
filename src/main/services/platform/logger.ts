import { EventEmitter } from 'node:events';
import { LogMessage, LogLevel } from '@domain/common/log';

/**
 * アプリケーション全体のログ管理を行うクラス。
 * EventEmitter を継承し、ログ出力時にイベントを発火させます。
 */
class Logger extends EventEmitter {
  static #instance: Logger;

  private constructor() {
    super();
  }

  /**
   * Logger のシングルトンインスタンスを取得します。
   */
  public static getInstance(): Logger {
    if (!Logger.#instance) {
      Logger.#instance = new Logger();
    }
    return Logger.#instance;
  }

  /**
   * ログを出力し、イベントを発火させます。
   * @param level ログレベル
   * @param message メッセージ
   */
  #log(level: LogLevel, message: string): void {
    const logMessage: LogMessage = {
      level,
      message,
      timestamp: Date.now()
    };
    this.emit('log', logMessage);

    // 標準出力にも出す
    const timestamp = new Date(logMessage.timestamp).toLocaleTimeString();
    console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
  }

  public info(message: string): void {
    this.#log('info', message);
  }

  public warn(message: string): void {
    this.#log('warn', message);
  }

  public error(message: string): void {
    this.#log('error', message);
  }

  /**
   * ログイベントのリスナーを登録します。
   * イベント名を隠蔽し、型安全な購読を提供します。
   */
  public onLog(handler: (log: LogMessage) => void): void {
    this.on('log', handler);
  }
}

export const logger = Logger.getInstance();
