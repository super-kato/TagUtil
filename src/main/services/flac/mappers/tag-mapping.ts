import { CanonicalTagKey } from '@domain/flac/tag-definitions';
import { FlacMetadata } from '@domain/flac/models';

/**
 * CanonicalTagKey と FlacMetadata のプロパティ名とのマッピング定義。
 * これは実装（マッパー層）の都合であり、ドメイン知識ではないためサービス層に配置します。
 */
export const TAG_PROPERTY_MAP: Record<CanonicalTagKey, keyof FlacMetadata> = {
  TITLE: 'title',
  ARTIST: 'artist',
  ALBUM: 'album',
  ALBUMARTIST: 'albumArtist',
  DATE: 'date',
  GENRE: 'genre',
  COMMENT: 'comment',
  TRACKNUMBER: 'trackNumber',
  TRACKTOTAL: 'trackTotal',
  DISCNUMBER: 'discNumber',
  DISCTOTAL: 'discTotal',
  CATALOGNUMBER: 'catalogNumber'
} as const;
