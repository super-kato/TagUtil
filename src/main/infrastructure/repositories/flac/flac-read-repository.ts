import { logger } from '@main/infrastructure/logging/logger';
import {
  IGNORE_TAG_KEYS,
  RawFlacData,
  RawPicture,
  VorbisTags
} from '@main/infrastructure/repositories/repository-types';
import { computeMd5 } from '@main/utils/crypto';
import * as musicMetadata from 'music-metadata';

const LOG_CONTEXT = 'FlacReadRepo';

/**
 * 指定されたパスのFLACファイルから生のメタデータを読み取ります。
 */
export const readRawFlacData = async (filePath: string): Promise<RawFlacData> => {
  const mmData = await musicMetadata.parseFile(filePath);
  const vorbis = mmData.native.vorbis || [];

  logger.debug({ context: LOG_CONTEXT, message: `Parsing completed: ${filePath}` });

  return {
    path: filePath,
    tags: mapLibTagsToRaw(vorbis),
    pictures: mapLibPicturesToRaw(mmData.common.picture || []),
    audioFormat: {
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

    // デバッグ用: 値の中にカンマが含まれているか、あるいは配列として来ているかチェック
    if (key === 'ARTIST' && typeof tag.value === 'string' && tag.value.includes(',')) {
      // もしここを通るなら、music-metadata が既に結合した状態で値を返している
      console.error(`!!!! DETECTED JOINED TAG: ${key} = ${tag.value}`);
    }

    // 値が配列の場合は展開し、そうでなければ文字列として追加
    if (Array.isArray(tag.value)) {
      normalized[key].push(...tag.value.map((v) => String(v)));
    } else {
      normalized[key].push(String(tag.value));
    }
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
