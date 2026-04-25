/**
 * アプリケーション内で使用される共通メッセージの定義。
 */
export const MESSAGES = {
  /** スキャン件数制限に達した場合の警告メッセージ */
  SCAN_LIMIT_EXCEEDED: 'Scan limit (500 items) reached. Some files were skipped.'
} as const;
