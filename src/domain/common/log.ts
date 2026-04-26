import { generateId } from '@shared/utils/id';
import { getCurrentTimestamp } from '@shared/utils/date';

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
  /** コンテキスト（処理の識別子など） */
  context: string;
  /** メッセージ内容 */
  message: string;
  /** タイムスタンプ（ミリ秒） */
  timestamp: number;
}

/**
 * ログメッセージを受け取るハンドラーの型定義。
 */
export type LogHandler = (message: LogMessage) => void;

/**
 * 標準的なログメッセージオブジェクトを生成します。
 * @param level ログレベル
 * @param message メッセージ内容
 * @param context コンテキスト
 * @returns 生成された LogMessage オブジェクト
 */
export const createLogMessage = (level: LogLevel, message: string, context: string): LogMessage => {
  return {
    id: generateId(),
    level,
    context,
    message,
    timestamp: getCurrentTimestamp()
  };
};
