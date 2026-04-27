import { success } from '@domain/common/result';
import { AppResult } from '@domain/types';
import { appErrors } from '@domain/errors/definitions';

import { FlacTrack } from '@domain/flac/models';
import { toAppResultFailure } from '@main/utils/error-handler';
import { readRawFlacData } from '@main/infrastructure/repositories/flac/flac-read-repository';
import { mapToFlacMetadata } from './mappers/flac-read-mapper';

/**
 * 指定されたパスのFLACファイルからメタデータを読み取ります。
 * メモリ節約のため、画像の存在確認のみを行い、バイナリデータ自体は戻り値に含めません。
 * 画像を実際に表示する場合は、カスタムプロトコル (flac-image://) を使用してください。
 */
export const readMetadata = async (filePath: string): Promise<AppResult<FlacTrack>> => {
  try {
    const rawData = await readRawFlacData(filePath);
    const metadata = mapToFlacMetadata(rawData, filePath);
    return success({ path: filePath, metadata });
  } catch (error: unknown) {
    return toAppResultFailure(error, appErrors.parseFailed, { path: filePath });
  }
};
