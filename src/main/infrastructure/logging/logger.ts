import { LogHandler, LogParams, createLogMessage } from '@domain/common/log';
import log from 'electron-log/main';
import { EventEmitter } from 'node:events';
import { format } from 'node:util';
import { settingsRepository } from '@main/infrastructure/repositories/settings/settings-repository';

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

    // 保存されている設定、または環境（開発/本番）に基づいてログレベルを初期化
    this.updateLogLevel();
  }

  /**
   * 現在の設定に基づいてログレベル（ファイル出力および UI 転送）を更新します。
   */
  public updateLogLevel(): void {
    const level = settingsRepository.settings.logLevel;

    // ファイル出力およびコンソール出力レベルの設定
    // 開発・本番に関わらず、ユーザー設定に従う
    const logTaggerLevel = level === 'DEBUG' ? 'debug' : 'info';
    log.transports.file.level = logTaggerLevel;
    log.transports.console.level = logTaggerLevel;
  }

  public debug(options: LoggerOptions, ...args: unknown[]): void {
    this.#log({ ...options, level: 'DEBUG' }, ...args);
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

    // UI（Renderer）への転送
    // 設定が INFO の場合は DEBUG ログを抑制する
    const currentLevel = settingsRepository.settings.logLevel;
    if (!(currentLevel === 'INFO' && params.level === 'DEBUG')) {
      this.emit(Logger.#LOG_EVENT, logMessage);
    }

    const logText = `[${params.context}] ${formattedMessage}`;
    switch (params.level) {
      case 'DEBUG':
        log.debug(logText);
        break;
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
