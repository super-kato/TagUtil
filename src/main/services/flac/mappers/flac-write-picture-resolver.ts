import { Picture } from '@domain/flac/types';
import { FlacTags } from 'flac-tagger';
import fs from 'fs/promises';
import { RawFlacData } from '../types';

/** 書き込みに使用する最終的な画像データを解決（読み込み含む） */
export const resolvePictureForWrite = async (
  intent: Picture | null | undefined,
  rawData: RawFlacData
): Promise<FlacTags['picture']> => {
  // 削除指示の場合
  if (intent === null) {
    return undefined;
  }

  // 変更なし または 自身がソースの場合は既存を維持
  if (intent === undefined || intent.sourcePath === rawData.path) {
    const currentRawPicture = rawData.pictures[0];
    return currentRawPicture
      ? { mime: currentRawPicture.mime, buffer: Buffer.from(currentRawPicture.buffer) }
      : undefined;
  }

  // 外部ファイル指定の場合は読み込む
  const buffer = await fs.readFile(intent.sourcePath);
  return {
    mime: intent.format,
    buffer
  };
};
