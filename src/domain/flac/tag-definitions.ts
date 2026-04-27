/**
 * タグの定義情報を表すインターフェース。
 */
export interface TagDefinition {
  /** 互換性のために考慮する別名（Synonyms） */
  readonly synonyms: readonly string[];
  /** 複数値を保持するかどうか（true の場合は string[]、false の場合は string） */
  readonly multiValue: boolean;
}

/**
 * 本アプリにおける標準的なタグ（Canonical）の定義です。
 */
export const TAG_DEFINITIONS = {
  TITLE: { synonyms: [], multiValue: false },
  ARTIST: { synonyms: [], multiValue: true },
  ALBUM: { synonyms: [], multiValue: false },
  ALBUMARTIST: {
    synonyms: ['ALBUM ARTIST', 'ENSEMBLE'],
    multiValue: true
  },
  DATE: { synonyms: ['YEAR'], multiValue: false },
  GENRE: { synonyms: [], multiValue: true },
  COMMENT: { synonyms: ['DESCRIPTION'], multiValue: true },
  TRACKNUMBER: { synonyms: [], multiValue: false },
  TRACKTOTAL: { synonyms: ['TOTALTRACKS'], multiValue: false },
  DISCNUMBER: { synonyms: [], multiValue: false },
  DISCTOTAL: { synonyms: ['TOTALDISCS'], multiValue: false },
  CATALOGNUMBER: { synonyms: [], multiValue: false }
} as const satisfies Record<string, TagDefinition>;

/**
 * 標準タグキーの型定義です。
 */
export type CanonicalTagKey = keyof typeof TAG_DEFINITIONS;
