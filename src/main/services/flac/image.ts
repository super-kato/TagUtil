import { success } from '@domain/common/result';
import { AppResult } from '@domain/flac/types';
import { Picture } from '@domain/flac/models';
import { readFileWithHash } from '@main/infrastructure/repositories/file-repository';
import { getMimeTypeFromPath } from '@main/utils/mime';
import { pickImageFile } from '@services/platform/dialog';
import { readRawFlacData } from '@main/infrastructure/repositories/flac-read-repository';

/**
 * FLAC ファイルから埋め込まれた画像を抽出します。
 */
export const extractEmbeddedImage = async (
  filePath: string
): Promise<{ buffer: Uint8Array; mime: string } | null> => {
  const { pictures } = await readRawFlacData(filePath);
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
 * 指定されたパスの画像ファイルから Picture オブジェクトを生成して返します。
 * @param filePath 画像ファイルの絶対パス
 */
export const getImageInfo = async (filePath: string): Promise<AppResult<Picture>> => {
  const { hash } = await readFileWithHash(filePath);
  return success({
    format: getMimeTypeFromPath(filePath),
    sourcePath: filePath,
    hash: hash
  });
};

/**
 * 画像ファイル選択ダイアログを表示し、選択された画像のパス情報を返します。
 * @returns 選択された画像のパス情報。キャンセルされた場合は Result(null)。
 */
export const pickImage = async (): Promise<AppResult<Picture | null>> => {
  const filePath = await pickImageFile();

  if (!filePath) {
    return success(null);
  }

  return await getImageInfo(filePath);
};
