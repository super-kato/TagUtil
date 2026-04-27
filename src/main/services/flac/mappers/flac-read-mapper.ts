import { FlacMetadata, Picture } from '@domain/flac/models';
import {
  CanonicalTagKey,
  MULTI_VALUE_PROPERTY_MAP,
  MultiValueCanonicalTagKey,
  SINGLE_VALUE_PROPERTY_MAP,
  SingleValueCanonicalTagKey,
  TAG_DEFINITIONS
} from '@domain/audio/tag-definitions';

import { RawFlacData, VorbisTags } from '@main/infrastructure/repositories/repository-types';

/** パース済みの生データをドメインモデルに変換 */
export const mapToFlacMetadata = (rawData: RawFlacData, filePath: string): FlacMetadata => {
  const { tags } = rawData;

  const acc: FlacMetadata = {
    picture: mapToDomainPicture(rawData, filePath),
    streamInfo: rawData.streamInfo
  };

  // 複数値タグのマッピング
  for (const key of Object.keys(MULTI_VALUE_PROPERTY_MAP) as MultiValueCanonicalTagKey[]) {
    const values = getAllTags(tags, key);
    if (values === undefined) {
      continue;
    }
    const propertyName = MULTI_VALUE_PROPERTY_MAP[key];
    acc[propertyName] = values;
  }
  // 単一値タグのマッピング
  for (const key of Object.keys(SINGLE_VALUE_PROPERTY_MAP) as SingleValueCanonicalTagKey[]) {
    const value = getFirstTag(tags, key);
    if (value === undefined) {
      continue;
    }
    const propertyName = SINGLE_VALUE_PROPERTY_MAP[key];
    acc[propertyName] = value;
  }

  return acc;
};

/** タグマップから指定されたキー（およびその別名）の全値を配列で取得 */
const getAllTags = (tagMap: VorbisTags, canonicalKey: CanonicalTagKey): string[] | undefined => {
  const definition = TAG_DEFINITIONS[canonicalKey];
  const keysToTry = [canonicalKey, ...definition.synonyms];

  const results: string[] | undefined = [];
  for (const key of keysToTry) {
    const values = tagMap[key.toUpperCase()];
    if (values) {
      results.push(...values);
    }
  }

  return results.length > 0 ? results : undefined;
};

/** タグマップから最初に見つかった値を取得 */
const getFirstTag = (tagMap: VorbisTags, canonicalKey: CanonicalTagKey): string | undefined => {
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
