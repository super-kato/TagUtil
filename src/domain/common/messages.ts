/**
 * アプリケーション内で使用される共通メッセージの定義。
 */
export const MESSAGES = {
  /** スキャン件数制限に達した場合の警告メッセージ */
  SCAN_LIMIT_EXCEEDED: 'Scan limit (500 items) reached. Some files were skipped.',

  /** タグ操作に関連するエラーメッセージ */
  TAG_ERRORS: {
    FILE_NOT_FOUND: 'File not found',
    PERMISSION_DENIED: 'Permission denied',
    PARSE_FAILED: 'Failed to parse metadata',
    WRITE_FAILED: 'Failed to write metadata',
    SCAN_FAILED: 'Failed to scan directory',
    PICK_IMAGE_FAILED: 'Failed to pick image',
    MISSING_TRACK_NUMBER: 'Missing track number',
    MISSING_TITLE: 'Missing title'
  }
} as const;
