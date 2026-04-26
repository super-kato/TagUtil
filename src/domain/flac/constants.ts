/**
 * アプリケーションにおけるエラー種別のリテラル一覧。
 */
export const APP_ERROR_TYPES = [
  'FILE_NOT_FOUND',
  'PERMISSION_DENIED',
  'PARSE_FAILED',
  'WRITE_FAILED',
  'SCAN_FAILED',
  'PICK_IMAGE_FAILED',
  'MISSING_REQUIRED_TAG',
  'INVALID_RENAME_PATTERN'
] as const;

/**
 * リネームパターンで使用されるプレースホルダの定義。
 */
export const TAG_PLACEHOLDERS = {
  TRACK_NUMBER: '{trackNumber}',
  TITLE: '{title}',
  ALBUM: '{album}',
  ARTIST: '{artist}',
  DATE: '{date}',
  GENRE: '{genre}'
} as const;

/**
 * UIで推奨されるデフォルトのジャンルリスト。
 */
export const DEFAULT_GENRES = [
  'Pop',
  'Soundtrack',
  'Jazz',
  'Anime',
  'Game',
  'Classical',
  'World',
  'Electronic',
  'Vocaloid',
  'Instrumental',
  'Metal',
  'Ambient'
] as const;
