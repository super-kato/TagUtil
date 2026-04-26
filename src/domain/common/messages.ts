/**
 * アプリケーション内で使用される共通メッセージの定義。
 */
export const MESSAGES = {
  /** スキャン件数制限に達した場合の警告メッセージ */
  SCAN_LIMIT_EXCEEDED: 'Scan limit reached. Some files were skipped.',

  /** タグ操作に関連するエラーメッセージ */
  TAG_ERRORS: {
    FILE_NOT_FOUND: 'File not found',
    PERMISSION_DENIED: 'Permission denied',
    PARSE_FAILED: 'Failed to parse metadata',
    WRITE_FAILED: 'Failed to write metadata',
    SCAN_FAILED: 'Failed to scan directory',
    PICK_IMAGE_FAILED: 'Failed to pick image',
    MISSING_REQUIRED_TAG: 'Missing required tag for renaming',
    INVALID_RENAME_PATTERN: 'Invalid rename pattern (must contain at least one tag)'
  }
} as const;
