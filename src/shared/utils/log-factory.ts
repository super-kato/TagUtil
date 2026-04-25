import type { LogLevel, LogMessage } from '@domain/common/log';
import { generateId } from './id';

/**
 * 標準的なログメッセージオブジェクトを生成します。
 * @param level ログレベル
 * @param message メッセージ内容
 * @returns 生成された LogMessage オブジェクト
 */
export const createLogMessage = (level: LogLevel, message: string): LogMessage => {
  return {
    id: generateId(),
    level,
    message,
    timestamp: Date.now()
  };
};
