import { success } from '@domain/common/result';
import { appErrors } from '@domain/flac/errors';
import { FlacTrack } from '@domain/flac/models';
import { AppResult } from '@domain/flac/types';
import { toAppResultFailure } from '@main/utils/error-handler';
import { readRawFlacData } from '@main/infrastructure/repositories/flac/flac-read-repository';
import { writeFlacTagsWithAtomic } from '@main/infrastructure/repositories/flac/flac-write-repository';
import { mergeMetadataWithTags } from './mappers/flac-write-mapper';
import { resolvePictureForWrite } from './mappers/flac-write-picture-resolver';

/**
 * 指定されたパスのFLACファイルへメタデータを書き込みます。
 */
export const writeMetadata = async (track: FlacTrack): Promise<AppResult<string>> => {
  const { path, metadata } = track;

  try {
    const rawData = await readRawFlacData(path);
    const picture = await resolvePictureForWrite(metadata.picture, rawData);
    const mergedTags = mergeMetadataWithTags(rawData, metadata, picture);
    await writeFlacTagsWithAtomic(path, mergedTags);
  } catch (error: unknown) {
    return toAppResultFailure(error, appErrors.writeFailed, { path });
  }
  return success(path);
};
