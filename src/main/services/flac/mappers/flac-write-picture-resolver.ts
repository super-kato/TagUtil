import { Picture } from '@domain/flac/models';
import { readFileWithHash } from '@main/infrastructure/repositories/file-repository';
import { RawFlacData, RawPicture } from '@main/infrastructure/repositories/repository-types';

/** 書き込みに使用する最終的な画像データを解決（読み込み含む） */
export const resolvePictureForWrite = async (
  intent: Picture | null | undefined,
  rawData: RawFlacData
): Promise<RawPicture | undefined> => {
  // 削除指示の場合
  if (intent === null) {
    return undefined;
  }

  // 変更なし または 自身がソースの場合は既存を維持
  if (intent === undefined || intent.sourcePath === rawData.path) {
    return rawData.pictures[0];
  }

  // 外部ファイル指定の場合は読み込む
  const content = await readFileWithHash(intent.sourcePath);
  return { mime: intent.format, ...content };
};
