/**
 * ファイル名生成で使用されるプレースホルダの定義。
 * 複数の層（ドメイン、設定、UI）から参照されるため、低レイヤーの shared フォルダに定義します。
 */
export const TAG_PLACEHOLDERS = {
  TRACK_NUMBER: '{trackNumber}',
  TITLE: '{title}',
  ALBUM: '{album}',
  ARTIST: '{artist}',
  YEAR: '{year}',
  GENRE: '{genre}'
} as const;
