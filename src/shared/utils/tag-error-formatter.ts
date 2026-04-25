import { isTagError, type TagError } from '@domain/flac/types';

/**
 * エラー種別ごとの基本ラベル。
 */
const ERROR_LABELS: Record<TagError['type'], string> = {
  FILE_NOT_FOUND: 'File not found',
  PERMISSION_DENIED: 'Permission denied',
  PARSE_FAILED: 'Failed to parse metadata',
  WRITE_FAILED: 'Failed to write metadata',
  SCAN_FAILED: 'Failed to scan directory',
  PICK_IMAGE_FAILED: 'Failed to pick image',
  MISSING_TRACK_NUMBER: 'Missing track number',
  MISSING_TITLE: 'Missing title'
};

/**
 * TagError 型を人間が読めるメッセージに変換します。
 */
const translateTagError = (error: TagError): string => {
  const label = ERROR_LABELS[error.type] || 'Unknown error';
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
