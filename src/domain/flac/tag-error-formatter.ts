import { isTagError, type TagError } from './errors';
import { MESSAGES } from '@domain/common/messages';

/**
 * TagError 型を人間が読めるメッセージに変換します。
 */
const translateTagError = (error: TagError): string => {
  const label = MESSAGES.TAG_ERRORS[error.type] || 'Unknown error';
  const detail = error.options.detail;

  return detail ? `${label}: ${detail}` : label;
};

/**
 * エラーオブジェクトを人間が読めるメッセージに変換します。
 * メインプロセスのロギングやレンダラープロセスのUI表示の両方で利用されます。
 */
export const formatTagError = (error: unknown): string => {
  if (isTagError(error)) {
    return translateTagError(error);
  } else if (error instanceof Error) {
    return error.message;
  } else {
    return String(error);
  }
};
