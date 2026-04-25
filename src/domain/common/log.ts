/**
 * ログレベルの定義。
 */
export type LogLevel = 'INFO' | 'WARN' | 'ERROR';

/**
 * ログメッセージの構造。
 */
export interface LogMessage {
  /** 一意の識別子 */
  id: string;
  /** ログレベル */
  level: LogLevel;
  /** メッセージ内容 */
  message: string;
  /** タイムスタンプ（ミリ秒） */
  timestamp: number;
}

/**
 * ログメッセージを受け取るハンドラーの型定義。
 */
export type LogHandler = (message: LogMessage) => void;
