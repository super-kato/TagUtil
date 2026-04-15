import { Picture } from '@domain/flac/types';
import { FlacTags } from 'flac-tagger';
import fs from 'fs/promises';
import { RawFlacData } from '../types';

/**
 * メタデータの指示に基づき、書き込みに使用する最終的な画像データを解決します。
 * この関数は I/O (fs.readFile) を実行します。
 *
 * @param intent ドメインモデルでの画像設定指示
 * @param rawData 現在のファイルから読み取られた生のデータ
 */
export const resolvePictureForWrite = async (
  intent: Picture | null | undefined,
  rawData: RawFlacData
): Promise<FlacTags['picture']> => {
  // 1. 削除指示（null）の場合
  if (intent === null) {
    return undefined;
  }

  // 2. 画像変更なし（undefined）、または「自身」がソースとして指定されている場合、既存を維持
  if (intent === undefined || intent.sourcePath === rawData.path) {
    const currentRawPicture = rawData.pictures[0];
    return currentRawPicture
      ? { mime: currentRawPicture.mime, buffer: Buffer.from(currentRawPicture.buffer) }
      : undefined;
  }

  // 3. 外部ファイルが指定されている場合、新たに読み込む
  const buffer = await fs.readFile(intent.sourcePath);
  return {
    mime: intent.format,
    buffer
  };
};
