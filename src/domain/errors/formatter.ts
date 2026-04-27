import { isAppError, type AppError } from './definitions';
import { MESSAGES } from '@domain/common/messages';

/**
 * AppError 型を人間が読めるメッセージに変換します。
 */
const translateAppError = (error: AppError): string => {
  const label = MESSAGES.APP_ERRORS[error.type] || 'Unknown error';
  const detail = error.options.detail;

  return detail ? `${label}: ${detail}` : label;
};

/**
 * エラーオブジェクトを人間が読めるメッセージに変換します。
 * メインプロセスのロギングやレンダラープロセスのUI表示の両方で利用されます。
 */
export const formatAppError = (error: unknown): string => {
  if (isAppError(error)) {
    return translateAppError(error);
  } else if (error instanceof Error) {
    return error.message;
  } else {
    return String(error);
  }
};
