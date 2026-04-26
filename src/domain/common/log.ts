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
 * ログメッセージ生成のためのパラメータ。
 */
export interface LogParams {
  /** ログレベル */
  level: LogLevel;
  /** コンテキスト（処理の識別子など） */
  context: string;
  /** メッセージ内容 */
  message: string;
}

/**
 * ログメッセージを受け取るハンドラーの型定義。
 */
export type LogHandler = (message: LogMessage) => void;

/**
 * 標準的なログメッセージオブジェクトを生成します。
 * @param params ログパラメータ
 * @returns 生成された LogMessage オブジェクト
 */
export const createLogMessage = (params: LogParams): LogMessage => {
  return {
    id: generateId(),
    level: params.level,
    context: params.context,
    message: params.message,
    timestamp: getCurrentTimestamp()
  };
};
