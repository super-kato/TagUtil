import { FlacMetadata, Picture } from '@domain/flac/types';
import { FlacTagMap, FlacTags } from 'flac-tagger';
import fs from 'fs/promises';
import { CanonicalTagKey, TAG_DEFINITIONS } from './tag-definitions';
import { RawFlacData, RawPicture } from './types';

/**
 * 既存の生のメタデータとドメインモデルの情報をマージし、書き込み用の FlacTags オブジェクトを返します。
 */
export const mergeMetadataWithTags = async (
  rawData: RawFlacData,
  metadata: FlacMetadata,
  targetFilePath: string
): Promise<FlacTags> => {
  // 1. テキストタグのマージ
  const tagMap = applyTextMetadata(convertRawTagsToFlacTagMap(rawData.tags), metadata);

  // 2. 画像データの解決
  const firstPicture = rawData.pictures[0];
  if (metadata.picture !== undefined) {
    return {
      tagMap,
      picture: await resolvePicture(targetFilePath, metadata.picture, firstPicture)
    };
  }
  // 変更なしの場合は既存の画像を維持
  if (!firstPicture) {
    return { tagMap, picture: undefined };
  }
  return { tagMap, picture: { mime: firstPicture.mime, buffer: Buffer.from(firstPicture.buffer) } };
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
 * 新しいタグマップを返します。
 */
const applyTextMetadata = (tagMap: FlacTagMap, metadata: FlacMetadata): FlacTagMap => {
  const fields: Record<CanonicalTagKey, string | string[] | undefined> = {
    TITLE: metadata.title,
    ARTIST: metadata.artist,
    ALBUM: metadata.album,
    ALBUMARTIST: metadata.albumArtist,
    DATE: metadata.date,
    COMMENT: metadata.comment,
    GENRE: metadata.genre,
    TRACKNUMBER: metadata.trackNumber,
    TRACKTOTAL: metadata.trackTotal,
    DISCNUMBER: metadata.discNumber,
    DISCTOTAL: metadata.discTotal,
    CATALOGNUMBER: metadata.catalogNumber
  };

  return Object.entries(fields).reduce((acc, [key, value]) => {
    return mergeField(acc, key as CanonicalTagKey, value);
  }, tagMap);
};

/**
 * メタデータの指示に基づき、書き込み用の画像データを解決します。
 */
const resolvePicture = async (
  targetFilePath: string,
  pictureMetadata: Picture | null,
  currentRawPicture?: RawPicture
): Promise<FlacTags['picture']> => {
  // 1. 削除指示の場合
  if (pictureMetadata === null) {
    return undefined;
  }

  const { sourcePath } = pictureMetadata;

  // 2. 変更なし（自身のファイルがソース）の場合
  if (sourcePath === targetFilePath) {
    return currentRawPicture
      ? { mime: currentRawPicture.mime, buffer: Buffer.from(currentRawPicture.buffer) }
      : undefined;
  }

  // 3. 新規画像ファイルから読み込む場合
  const buffer = await fs.readFile(sourcePath);
  return {
    mime: pictureMetadata.format,
    buffer
  };
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
  const synonyms = TAG_DEFINITIONS[canonicalKey] as ReadonlyArray<string>;
  const keysToDelete = [canonicalKey, ...synonyms];

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
