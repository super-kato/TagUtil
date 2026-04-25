/**
 * ログレベルの定義。
 */
export type LogLevel = 'info' | 'warn' | 'error';

/**
 * ログメッセージの構造。
 */
export interface LogMessage {
  /** ログレベル */
  level: LogLevel;
  /** メッセージ内容 */
  message: string;
  /** タイムスタンプ（ミリ秒） */
  timestamp: number;
}
