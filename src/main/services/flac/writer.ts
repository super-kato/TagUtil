import { success } from '@domain/common/result';
import { AppResult } from '@domain/flac/types';
import { appErrors } from '@domain/flac/errors';
import { FlacTrack } from '@domain/flac/models';
import { writeFlacTags } from 'flac-tagger';
import { toAppResultFailure } from '@main/utils/error-handler';
import { withAtomicWrite } from '@main/utils/file-utils';
import { mergeMetadataWithTags } from './mappers/flac-write-mapper';
import { resolvePictureForWrite } from './mappers/flac-write-picture-resolver';
import { readRawData } from './reader';

/**
 * 指定されたパスのFLACファイルへメタデータを書き込みます。
 */
export const writeMetadata = async (track: FlacTrack): Promise<AppResult<void>> => {
  const { path, metadata } = track;

  try {
    const rawData = await readRawData(path);

    // 書き込み用の最終的な画像を解決（既存維持、削除、更新のいずれか）
    const picture = await resolvePictureForWrite(metadata.picture, rawData);

    const mergedTags = mergeMetadataWithTags(rawData, metadata, picture);

    await withAtomicWrite(path, async (tempPath) => await writeFlacTags(mergedTags, tempPath));

    return success(undefined);
  } catch (error: unknown) {
    return toAppResultFailure(error, appErrors.writeFailed, { path });
  }
};
