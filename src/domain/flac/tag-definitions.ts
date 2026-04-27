import { FlacMetadata } from './models';

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

/**
 * 複数値（string[]）を持つタグの標準キーの型。
 */
export type MultiValueCanonicalTagKey = {
  [K in CanonicalTagKey]: (typeof TAG_DEFINITIONS)[K]['multiValue'] extends true ? K : never;
}[CanonicalTagKey];

/**
 * 単一値（string）を持つタグの標準キーの型。
 */
export type SingleValueCanonicalTagKey = Exclude<CanonicalTagKey, MultiValueCanonicalTagKey>;

/**
 * FlacMetadata のプロパティのうち、複数値（string[]）を持つもののキーを抽出する型。
 */
export type MultiValueMetadataKey = {
  [K in keyof FlacMetadata]: FlacMetadata[K] extends string[] | undefined ? K : never;
}[keyof FlacMetadata] &
  keyof FlacMetadata;

/**
 * FlacMetadata のプロパティのうち、単一値（string）を持つもののキーを抽出する型。
 */
export type SingleValueMetadataKey = {
  [K in keyof FlacMetadata]: FlacMetadata[K] extends string | undefined ? K : never;
}[keyof FlacMetadata] &
  keyof FlacMetadata;

/**
 * 複数値タグのマッピング定義。
 */
export const MULTI_VALUE_PROPERTY_MAP: Record<MultiValueCanonicalTagKey, MultiValueMetadataKey> = {
  ARTIST: 'artist',
  ALBUMARTIST: 'albumArtist',
  GENRE: 'genre',
  COMMENT: 'comment'
} as const;

/**
 * 単一値タグのマッピング定義。
 */
export const SINGLE_VALUE_PROPERTY_MAP: Record<SingleValueCanonicalTagKey, SingleValueMetadataKey> =
  {
    TITLE: 'title',
    ALBUM: 'album',
    DATE: 'date',
    TRACKNUMBER: 'trackNumber',
    TRACKTOTAL: 'trackTotal',
    DISCNUMBER: 'discNumber',
    DISCTOTAL: 'discTotal',
    CATALOGNUMBER: 'catalogNumber'
  } as const;
