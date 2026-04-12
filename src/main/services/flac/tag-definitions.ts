/**
 * 本アプリにおける標準的なタグ（Canonical）と、互換性のために考慮する別名（Synonyms）の定義です。
 */
export const TAG_DEFINITIONS = {
  TITLE: [],
  ARTIST: [],
  ALBUM: [],
  ALBUMARTIST: ['ALBUM ARTIST', 'ENSEMBLE'],
  DATE: ['YEAR'],
  GENRE: [],
  COMMENT: ['DESCRIPTION'],
  TRACKNUMBER: [],
  TRACKTOTAL: ['TOTALTRACKS'],
  DISCNUMBER: [],
  DISCTOTAL: ['TOTALDISCS'],
  CATALOGNUMBER: []
} as const;

/**
 * 標準タグキーの型定義です。
 */
export type CanonicalTagKey = keyof typeof TAG_DEFINITIONS;
