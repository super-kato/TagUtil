import { app } from 'electron';
import { EventEmitter } from 'node:events';
import { format } from 'node:util';
import log from 'electron-log/main';
import { LogHandler, LogParams, createLogMessage } from '@domain/common/log';

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

  constructor() {
    super();
    log.initialize();
    log.errorHandler.startCatching();

    // 本番環境（パッケージ化後）は warning と error しかファイルに書き込まない
    if (app.isPackaged) {
      log.transports.file.level = 'warn';
    } else {
      log.transports.file.level = 'debug';
    }
  }

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

    const logText = `[${params.context}] ${formattedMessage}`;
    switch (params.level) {
      case 'INFO':
        log.info(logText);
        break;
      case 'WARN':
        log.warn(logText);
        break;
      case 'ERROR':
        log.error(logText);
        break;
    }
  }
}

/**
 * Logger のシングルトンインスタンス。
 */
export const logger = new Logger();
