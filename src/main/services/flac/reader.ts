import { success } from '@domain/common/result';
import { CanonicalTagKey, TAG_DEFINITIONS } from '@domain/flac/tag-definitions';
import { FlacMetadata, FlacTrack, Picture, tagErrors, TagResult } from '@domain/flac/types';
import fs from 'fs/promises';
import * as readerImpl from 'music-metadata';
import { toTagResultFailure } from '../../utils/error-handler';
import { computeMd5 } from '../../utils/hash';
import { RawFlacData, RawPicture } from './types';

/**
 * テキストタグとして読み込み・書き込みをスキップするタグキーのリスト。
 */
const IGNORE_TAG_KEYS = ['METADATA_BLOCK_PICTURE'] as const;

/**
 * 指定されたパスのFLACファイルからメタデータを読み取ります。
 * メモリ節約のため、画像の存在確認のみを行い、バイナリデータ自体は戻り値に含めません。
 * 画像を実際に表示する場合は、カスタムプロトコル (flac-image://) を使用してください。
 */
export const readMetadata = async (filePath: string): Promise<TagResult<FlacTrack>> => {
  try {
    await ensureFileExists(filePath);
    const rawData = await readRawData(filePath);
    const metadata = mapToFlacMetadata(rawData, filePath);
    return success({ path: filePath, metadata });
  } catch (error: unknown) {
    return toTagResultFailure(error, tagErrors.parseFailed, { path: filePath });
  }
};

/**
 * 低レイヤーな生のメタデータを取得します。
 * 内部でのマージ処理やバイナリデータ取得に使用します。
 */
export const readRawData = async (filePath: string): Promise<RawFlacData> => {
  const mmData = await readerImpl.parseFile(filePath);

  return {
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

/**
 * music-metadata のタグ配列を、検索しやすい Record 形式に変換します。
 */
const normalizeVorbisTags = (tags: readerImpl.ITag[]): Record<string, string[]> => {
  const normalized: Record<string, string[]> = {};
  for (const tag of tags) {
    const key = tag.id.toUpperCase();

    // 除外リストに含まれるタグは、パースエラーを避けたり、冗長なデータを排除したりするためにスキップします。
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

/**
 * music-metadata の画像を RawPicture 配列に変換します。
 */
const mapPictures = (pictures: readerImpl.IPicture[]): RawPicture[] => {
  return pictures.map((p) => ({
    mime: p.format,
    buffer: p.data,
    hash: computeMd5(p.data)
  }));
};

/**
 * 読み取り対象のファイルが存在し、アクセス可能であることを確認します。
 */
const ensureFileExists = async (filePath: string): Promise<void> => {
  await fs.access(filePath);
};

/**
 * 生のデータをドメインモデルに変換します。
 */
const mapToFlacMetadata = (rawData: RawFlacData, filePath: string): FlacMetadata => {
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

/**
 * タグマップから指定されたキー（およびその別名）に該当するすべての値を配列で返します。
 */
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

/**
 * タグマップから最初に見つかった値を返します。
 */
const getFirstTag = (
  tagMap: Record<string, string[]>,
  canonicalKey: CanonicalTagKey
): string | undefined => {
  const values = getAllTags(tagMap, canonicalKey);
  return values ? values[0] : undefined;
};

/**
 * ドメイン用の画像情報を生成します（パスのみ）。
 */
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
