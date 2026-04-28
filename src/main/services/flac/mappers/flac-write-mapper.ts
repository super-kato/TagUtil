import {
  CanonicalTagKey,
  MULTI_VALUE_PROPERTY_MAP,
  MultiValueCanonicalTagKey,
  SINGLE_VALUE_PROPERTY_MAP,
  SingleValueCanonicalTagKey,
  TAG_DEFINITIONS
} from '@domain/audio/tag-definitions';
import { FlacMetadata } from '@domain/flac/models';
import {
  RawFlacData,
  RawFlacTags,
  RawPicture,
  VorbisTags
} from '@main/infrastructure/repositories/repository-types';

/**
 * 既存の生のメタデータとドメインモデルの情報をマージし、書き込み用のタグデータを返します。
 * この関数は副作用（I/O）を持たない純粋関数です。
 *
 * @param rawData 既存の読み取りデータ
 * @param metadata 更新後のドメインモデル
 * @param picture 解決済みの画像データ（ライター側で決定）
 */
export const mergeMetadataWithTags = (
  rawData: RawFlacData,
  metadata: FlacMetadata,
  picture?: RawPicture
): RawFlacTags => {
  return {
    tags: applyTextMetadata(rawData.tags, metadata),
    pictures: picture ? [picture] : []
  };
};

/**
 * 送信されたメタデータ（テキスト）をタグマップに適用します。
 */
const applyTextMetadata = (tags: VorbisTags, metadata: FlacMetadata): VorbisTags => {
  const multiValueApplied = (
    Object.keys(MULTI_VALUE_PROPERTY_MAP) as MultiValueCanonicalTagKey[]
  ).reduce((acc, key) => mergeField(acc, key, metadata[MULTI_VALUE_PROPERTY_MAP[key]]), tags);

  return (Object.keys(SINGLE_VALUE_PROPERTY_MAP) as SingleValueCanonicalTagKey[]).reduce(
    (acc, key) => mergeField(acc, key, metadata[SINGLE_VALUE_PROPERTY_MAP[key]]),
    multiValueApplied
  );
};

/**
 * 特定のフィールドをマージまたは削除した新しいマップを返します。
 */
const mergeField = (
  tags: VorbisTags,
  canonicalKey: CanonicalTagKey,
  value: string | string[] | undefined
): VorbisTags => {
  if (value === undefined) {
    return tags;
  }

  const newMap = { ...tags };

  // 1. クリーンアップ
  const definition = TAG_DEFINITIONS[canonicalKey];
  const keysToDelete = [canonicalKey, ...definition.synonyms];

  for (const key of keysToDelete) {
    delete newMap[key.toUpperCase()];
    delete newMap[key.toLowerCase()];
  }

  // 2. セット
  if (Array.isArray(value)) {
    // 空欄を除外したリストをセット
    const filteredValues = value.filter((v) => v !== '');
    if (filteredValues.length > 0) {
      newMap[canonicalKey.toUpperCase()] = filteredValues;
    }
  } else if (value !== '') {
    newMap[canonicalKey.toUpperCase()] = [value];
  }

  return newMap;
};
