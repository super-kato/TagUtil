import { success } from '@domain/common/result';
import { appErrors } from '@domain/errors/definitions';
import { FlacTrack } from '@domain/flac/models';
import { AppResult } from '@domain/types';
import { logger } from '@main/infrastructure/logging/logger';
import { readRawFlacData } from '@main/infrastructure/repositories/flac/flac-read-repository';
import { writeFlacTagsWithAtomic } from '@main/infrastructure/repositories/flac/flac-write-repository';
import { toAppResultFailure } from '@main/utils/error-handler';
import { mergeMetadataWithTags } from './mappers/flac-write-mapper';
import { resolvePictureForWrite } from './mappers/flac-write-picture-resolver';

const LOG_CONTEXT = 'WriteMetadata';

/**
 * 指定されたパスのFLACファイルへメタデータを書き込みます。
 */
export const writeMetadata = async (track: FlacTrack): Promise<AppResult<string>> => {
  const { path, metadata } = track;
  logger.debug({ context: LOG_CONTEXT, message: `Starting to write metadata: ${path}` });

  try {
    const rawData = await readRawFlacData(path);
    const picture = await resolvePictureForWrite(metadata.picture, rawData);
    const mergedTags = mergeMetadataWithTags(rawData, metadata, picture);
    await writeFlacTagsWithAtomic(path, mergedTags);

    logger.debug({ context: LOG_CONTEXT, message: `Write completed: ${path}` });
  } catch (error: unknown) {
    return toAppResultFailure(error, appErrors.writeFailed, { path });
  }
  return success(path);
};
