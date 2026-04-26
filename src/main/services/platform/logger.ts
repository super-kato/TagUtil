import { EventEmitter } from 'node:events';
import { format } from 'node:util';
import { LogHandler, LogParams, createLogMessage } from '@domain/common/log';
import { formatTimeWithMs } from '@shared/utils/date';

/**
 * ロガーに渡されるオプション引数。
 */
type LoggerOptions = Omit<LogParams, 'level'>;

/**
 * アプリケーション全体のログ管理を行うクラス。
 * EventEmitter を継承し、ログ出力時にイベントを発火させます。
 * クラス自体は非公開とし、シングルトンインスタンスのみを公開します。
 */
class Logger extends EventEmitter {
  static readonly #LOG_EVENT = 'log';

  public info(options: LoggerOptions, ...args: unknown[]): void {
    this.#log({ ...options, level: 'INFO' }, ...args);
  }

  public warn(options: LoggerOptions, ...args: unknown[]): void {
    this.#log({ ...options, level: 'WARN' }, ...args);
  }

  public error(options: LoggerOptions, ...args: unknown[]): void {
    this.#log({ ...options, level: 'ERROR' }, ...args);
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
   * @param params ログパラメータ
   * @param args 追加の引数
   */
  #log(params: LogParams, ...args: unknown[]): void {
    const formattedMessage = format(params.message, ...args);
    const logMessage = createLogMessage({
      level: params.level,
      context: params.context,
      message: formattedMessage
    });
    this.emit(Logger.#LOG_EVENT, logMessage);

    // 標準出力にも出す
    const timePrefix = `[${formatTimeWithMs(logMessage.timestamp)}]`;
    console.log(`${timePrefix} [${params.level}] [${params.context}] ${formattedMessage}`);
  }
}

/**
 * Logger のシングルトンインスタンス。
 */
export const logger = new Logger();
