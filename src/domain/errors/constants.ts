/**
 * アプリケーションにおけるエラー種別のリテラル一覧。
 */
export const APP_ERROR_TYPES = [
  'PARSE_FAILED',
  'WRITE_FAILED',
  'SCAN_FAILED',
  'PICK_IMAGE_FAILED',
  'MISSING_REQUIRED_TAG',
  'INVALID_RENAME_PATTERN'
] as const;
