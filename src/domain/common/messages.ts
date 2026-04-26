import { MESSAGES } from './messages';

/**
 * アプリケーション共通のメッセージ定義。
 */
export const COMMON_MESSAGES = {
  /** アプリケーションにおけるエラーメッセージ */
  APP_ERRORS: {
    PARSE_FAILED: 'Failed to parse metadata',
    WRITE_FAILED: 'Failed to write metadata',
    SCAN_FAILED: 'Failed to scan directory',
    PICK_IMAGE_FAILED: 'Failed to pick image',
    MISSING_REQUIRED_TAG: 'Missing required tag for renaming',
    INVALID_RENAME_PATTERN: 'Invalid rename pattern (must contain at least one tag)'
  },

  /** 成功メッセージ */
  SUCCESS: {
    SAVED: 'Successfully saved metadata',
    RENAMED: 'Successfully renamed file'
  },

  /** 確認ダイアログ等 */
  CONFIRM: {
    SAVE_CHANGES: 'Save changes to the file?',
    UNSAVED_CHANGES: 'There are unsaved changes. Do you want to discard them?'
  }
} as const;

export const APP_MESSAGES = MESSAGES;
