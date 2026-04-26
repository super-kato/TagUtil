/**
 * アプリケーション共通のメッセージ定義。
 */
export const MESSAGES = {
  /** アプリケーションにおけるエラーメッセージ */
  APP_ERRORS: {
    PARSE_FAILED: 'Failed to parse metadata',
    WRITE_FAILED: 'Failed to write metadata',
    SCAN_FAILED: 'Failed to scan directory',
    PICK_IMAGE_FAILED: 'Failed to pick image',
    MISSING_REQUIRED_TAG: 'Missing required tag for renaming',
    INVALID_RENAME_PATTERN: 'Invalid rename pattern (must contain at least one tag)'
  },
  /** その他警告メッセージ */
  SCAN_LIMIT_EXCEEDED: 'Too many files found. Only the first 1000 files were loaded.'
} as const;
