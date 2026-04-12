import { success } from '@domain/common/result';
import { Picture, TagResult } from '@domain/flac/types';
import { readFile } from 'node:fs/promises';
import { computeMd5 } from '../../utils/hash';
import { getMimeTypeFromPath } from '../../utils/mime';
import { pickImageFile } from '../platform/dialog';
import { readRawData } from './reader';

/**
 * FLAC ファイルから埋め込まれた画像を抽出します。
 */
export const extractEmbeddedImage = async (
  filePath: string
): Promise<{ buffer: Uint8Array; mime: string } | null> => {
  const { pictures } = await readRawData(filePath);
  const picture = pictures[0];

  if (!picture) {
    return null;
  }

  return {
    buffer: picture.buffer,
    mime: picture.mime || 'image/jpeg'
  };
};

/**
 * 画像ファイル選択ダイアログを表示し、選択された画像のパス情報を返します。
 * @returns 選択された画像のパス情報。キャンセルされた場合は Result(null)。
 */
export const pickImage = async (): Promise<TagResult<Picture | null>> => {
  const filePath = await pickImageFile();

  if (!filePath) {
    return success(null);
  }

  return success({
    format: getMimeTypeFromPath(filePath),
    sourcePath: filePath,
    hash: computeMd5(await readFile(filePath))
  });
};
