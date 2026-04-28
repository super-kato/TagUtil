import { Picture } from '@domain/audio/models';
import { success } from '@domain/common/result';
import { AppResult } from '@domain/types';
import { logger } from '@main/infrastructure/logging/logger';
import { pickImageFile } from '@main/infrastructure/platform/dialog';
import { readFileWithHash } from '@main/infrastructure/repositories/file/file-read-repository';
import { readRawFlacData } from '@main/infrastructure/repositories/flac/flac-read-repository';
import { getMimeTypeFromPath } from '@main/utils/mime';

const LOG_CONTEXT = 'FlacImage';

/**
 * FLAC ファイルから埋め込まれた画像を抽出します。
 */
export const extractEmbeddedImage = async (
  filePath: string
): Promise<{ buffer: Uint8Array; mime: string } | null> => {
  const { pictures } = await readRawFlacData(filePath);
  const picture = pictures[0];

  if (!picture) {
    logger.debug({ context: LOG_CONTEXT, message: `No image found in: ${filePath}` });
    return null;
  }

  logger.debug({
    context: LOG_CONTEXT,
    message: `Image extracted: ${filePath} (${picture.mime})`
  });
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
  logger.debug({ context: LOG_CONTEXT, message: 'Opening image picker dialog' });
  const filePath = await pickImageFile();

  if (!filePath) {
    logger.debug({ context: LOG_CONTEXT, message: 'Image picker cancelled' });
    return success(null);
  }

  logger.debug({ context: LOG_CONTEXT, message: `Image selected: ${filePath}` });
  return await getImageInfo(filePath);
};
