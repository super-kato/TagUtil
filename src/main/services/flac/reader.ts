import { success } from '@domain/common/result';
import { FlacTrack, tagErrors, TagResult } from '@domain/flac/types';
import * as readerImpl from 'music-metadata';
import { toTagResultFailure } from '@utils/error-handler';
import { ensureFileExists } from '@utils/fs';
import { mapToFlacMetadata, toRawFlacData } from './mappers/flac-read-mapper';
import { RawFlacData } from './types';

/**
 * 指定されたパスのFLACファイルからメタデータを読み取ります。
 * メモリ節約のため、画像の存在確認のみを行い、バイナリデータ自体は戻り値に含めません。
 * 画像を実際に表示する場合は、カスタムプロトコル (flac-image://) を使用してください。
 */
export const readMetadata = async (filePath: string): Promise<TagResult<FlacTrack>> => {
  try {
    await ensureFileExists(filePath);
    const rawData = await readRawData(filePath);
    const metadata = mapToFlacMetadata(rawData, filePath);
    return success({ path: filePath, metadata });
  } catch (error: unknown) {
    return toTagResultFailure(error, tagErrors.parseFailed, { path: filePath });
  }
};

/**
 * 低レイヤーな生のメタデータを取得します。
 * 内部でのマージ処理やバイナリデータ取得に使用します。
 */
export const readRawData = async (filePath: string): Promise<RawFlacData> => {
  const mmData = await readerImpl.parseFile(filePath);
  return toRawFlacData(mmData, filePath);
};
