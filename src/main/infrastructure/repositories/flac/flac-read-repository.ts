import { computeMd5 } from '@main/utils/crypto';
import * as musicMetadata from 'music-metadata';
import {
  IGNORE_TAG_KEYS,
  RawFlacData,
  RawPicture,
  VorbisTags
} from '@main/infrastructure/repositories/repository-types';

/**
 * 指定されたパスのFLACファイルから生のメタデータを読み取ります。
 */
export const readRawFlacData = async (filePath: string): Promise<RawFlacData> => {
  const mmData = await musicMetadata.parseFile(filePath);

  return {
    path: filePath,
    tags: mapLibTagsToRaw(mmData.native.vorbis || []),
    pictures: mapLibPicturesToRaw(mmData.common.picture || []),
    streamInfo: {
      sampleRate: mmData.format.sampleRate,
      bitDepth: mmData.format.bitsPerSample,
      channels: mmData.format.numberOfChannels,
      duration: mmData.format.duration
    }
  };
};

/**
 * music-metadata のタグ配列を VorbisTags に変換します。
 */
const mapLibTagsToRaw = (tags: musicMetadata.ITag[]): VorbisTags => {
  const normalized: VorbisTags = {};
  for (const tag of tags) {
    const key = tag.id.toUpperCase();

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
 * music-metadata の画像配列を RawPicture 配列に変換します。
 */
const mapLibPicturesToRaw = (pictures: musicMetadata.IPicture[]): RawPicture[] => {
  return pictures.map((p) => ({
    mime: p.format,
    buffer: p.data,
    hash: computeMd5(p.data)
  }));
};
