import { CanonicalTagKey, TAG_DEFINITIONS } from '@domain/flac/tag-definitions';
import { FlacMetadata, Picture } from '@domain/flac/types';
import type * as readerImpl from 'music-metadata';
import { computeMd5 } from '@utils/hash';
import { RawFlacData, RawPicture } from '@services/flac/types';

/**
 * テキストタグとして読み込み・書き込みをスキップするタグキーのリスト。
 */
const IGNORE_TAG_KEYS = ['METADATA_BLOCK_PICTURE'] as const;

/** music-metadata のパース結果を RawFlacData に変換 */
export const toRawFlacData = (mmData: readerImpl.IAudioMetadata, path: string): RawFlacData => {
  return {
    path,
    tags: normalizeVorbisTags(mmData.native.vorbis || []),
    pictures: mapPictures(mmData.common.picture || []),
    streamInfo: {
      sampleRate: mmData.format.sampleRate,
      bitDepth: mmData.format.bitsPerSample,
      channels: mmData.format.numberOfChannels,
      duration: mmData.format.duration
    }
  };
};

/** パース済みの生データをドメインモデルに変換 */
export const mapToFlacMetadata = (rawData: RawFlacData, filePath: string): FlacMetadata => {
  const { tags } = rawData;

  return {
    title: getFirstTag(tags, 'TITLE'),
    artist: getAllTags(tags, 'ARTIST'),
    album: getFirstTag(tags, 'ALBUM'),
    albumArtist: getAllTags(tags, 'ALBUMARTIST'),
    trackNumber: getFirstTag(tags, 'TRACKNUMBER'),
    trackTotal: getFirstTag(tags, 'TRACKTOTAL'),
    discNumber: getFirstTag(tags, 'DISCNUMBER'),
    discTotal: getFirstTag(tags, 'DISCTOTAL'),
    genre: getAllTags(tags, 'GENRE'),
    date: getFirstTag(tags, 'DATE'),
    comment: getAllTags(tags, 'COMMENT'),
    catalogNumber: getFirstTag(tags, 'CATALOGNUMBER'),
    picture: mapToDomainPicture(rawData, filePath),
    streamInfo: rawData.streamInfo
  };
};

/** ITag配列を Record<string, string[]> に変換 */
const normalizeVorbisTags = (tags: readerImpl.ITag[]): Record<string, string[]> => {
  const normalized: Record<string, string[]> = {};
  for (const tag of tags) {
    const key = tag.id.toUpperCase();

    // 除外リストに含まれるタグはスキップ
    if ((IGNORE_TAG_KEYS as readonly string[]).includes(key)) {
      continue;
    }

    if (!normalized[key]) {
      normalized[key] = [];
    }
    normalized[key].push(String(tag.value));
  }
  return normalized;
};

/** IPicture配列を RawPicture配列に変換 */
const mapPictures = (pictures: readerImpl.IPicture[]): RawPicture[] => {
  return pictures.map((p) => ({
    mime: p.format,
    buffer: p.data,
    hash: computeMd5(p.data)
  }));
};

/** タグマップから指定されたキー（およびその別名）の全値を配列で取得 */
const getAllTags = (
  tagMap: Record<string, string[]>,
  canonicalKey: CanonicalTagKey
): string[] | undefined => {
  const synonyms = TAG_DEFINITIONS[canonicalKey] as ReadonlyArray<string>;
  const keysToTry = [canonicalKey, ...synonyms];

  const results: string[] = [];
  for (const key of keysToTry) {
    const values = tagMap[key.toUpperCase()];
    if (values) {
      results.push(...values);
    }
  }

  return results.length > 0 ? results : undefined;
};

/** タグマップから最初に見つかった値を取得 */
const getFirstTag = (
  tagMap: Record<string, string[]>,
  canonicalKey: CanonicalTagKey
): string | undefined => {
  const values = getAllTags(tagMap, canonicalKey);
  return values ? values[0] : undefined;
};

/** ドメイン用の画像情報を生成 */
const mapToDomainPicture = (rawData: RawFlacData, sourcePath: string): Picture | undefined => {
  if (rawData.pictures.length === 0) {
    return undefined;
  }
  return {
    format: rawData.pictures[0].mime ?? 'image/unknown',
    sourcePath,
    hash: rawData.pictures[0].hash
  };
};
