import { FlacMetadata } from '@domain/flac/models';
import {
  CanonicalTagKey,
  MULTI_VALUE_PROPERTY_MAP,
  MultiValueCanonicalTagKey,
  SINGLE_VALUE_PROPERTY_MAP,
  SingleValueCanonicalTagKey,
  TAG_DEFINITIONS
} from '@domain/flac/tag-definitions';
import { RawFlacData } from '@services/flac/types';
import { FlacTagMap, FlacTags } from 'flac-tagger';

/**
 * 既存の生のメタデータとドメインモデルの情報をマージし、書き込み用の FlacTags オブジェクトを返します。
 * この関数は副作用（I/O）を持たない純粋関数です。
 *
 * @param rawData 既存の読み取りデータ
 * @param metadata 更新後のドメインモデル
 * @param picture 解決済みの画像データ（ライター側で決定）
 */
export const mergeMetadataWithTags = (
  rawData: RawFlacData,
  metadata: FlacMetadata,
  picture?: FlacTags['picture']
): FlacTags => {
  return {
    tagMap: applyTextMetadata(convertRawTagsToFlacTagMap(rawData.tags), metadata),
    picture
  };
};

/**
 * RawFlacData のタグ形式を FlacTagMap 形式に変換します。
 */
const convertRawTagsToFlacTagMap = (tags: Record<string, string[]>): FlacTagMap => {
  const map: FlacTagMap = {};
  for (const [key, values] of Object.entries(tags)) {
    map[key] = values.length === 1 ? values[0] : values;
  }
  return map;
};

/**
 * 送信されたメタデータ（テキスト）をタグマップに適用します。
 */
const applyTextMetadata = (tagMap: FlacTagMap, metadata: FlacMetadata): FlacTagMap => {
  const multiValueApplied = (
    Object.keys(MULTI_VALUE_PROPERTY_MAP) as MultiValueCanonicalTagKey[]
  ).reduce((acc, key) => {
    return mergeField(acc, key, metadata[MULTI_VALUE_PROPERTY_MAP[key]]);
  }, tagMap);

  return (Object.keys(SINGLE_VALUE_PROPERTY_MAP) as SingleValueCanonicalTagKey[]).reduce(
    (acc, key) => {
      return mergeField(acc, key, metadata[SINGLE_VALUE_PROPERTY_MAP[key]]);
    },
    multiValueApplied
  );
};

/**
 * 特定のフィールドをマージまたは削除した新しいマップを返します。
 */
const mergeField = (
  tagMap: FlacTagMap,
  canonicalKey: CanonicalTagKey,
  value: string | string[] | undefined
): FlacTagMap => {
  if (value === undefined) {
    return tagMap;
  }

  const newMap = { ...tagMap };

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
    newMap[canonicalKey.toUpperCase()] = value;
  }

  return newMap;
};
