import { success } from '@domain/common/result';
import { appErrors } from '@domain/errors/definitions';
import { FlacTrack } from '@domain/flac/models';
import { AppResult } from '@domain/types';
import { logger } from '@main/infrastructure/logging/logger';
import { readRawFlacData } from '@main/infrastructure/repositories/flac/flac-read-repository';
import { toAppResultFailure } from '@main/utils/error-handler';
import { mapToFlacMetadata } from './mappers/flac-read-mapper';

const LOG_CONTEXT = 'ReadMetadata';

/**
 * 指定されたパスのFLACファイルからメタデータを読み取ります。
 * メモリ節約のため、画像の存在確認のみを行い、バイナリデータ自体は戻り値に含めません。
 * 画像を実際に表示する場合は、カスタムプロトコル (flac-image://) を使用してください。
 */
export const readMetadata = async (filePath: string): Promise<AppResult<FlacTrack>> => {
  logger.debug({ context: LOG_CONTEXT, message: `Starting to read metadata: ${filePath}` });
  try {
    const rawData = await readRawFlacData(filePath);

    const metadata = mapToFlacMetadata(rawData, filePath);
    logger.debug({ context: LOG_CONTEXT, message: `Metadata mapping completed: ${filePath}` });

    return success({ path: filePath, metadata });
  } catch (error: unknown) {
    return toAppResultFailure(error, appErrors.parseFailed, { path: filePath });
  }
};
