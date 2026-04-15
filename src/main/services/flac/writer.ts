import { FlacMetadata, FlacTrack, TagResult, tagErrors } from '@domain/flac/types';
import { writeFlacTags } from 'flac-tagger';
import fs from 'fs/promises';
import { failure, success } from '@domain/common/result';
import { hasErrorCode, toTagResultFailure } from '../../utils/error-handler';
import { readRawData } from './reader';
import { mergeMetadataWithTags } from './mappers/flac-write-mapper';
import { resolvePictureForWrite } from './mappers/flac-write-picture-resolver';

/**
 * 指定されたパスのFLACファイルへメタデータを書き込みます。
 */
export const writeMetadata = async (track: FlacTrack): Promise<TagResult<void>> => {
  const { path, metadata } = track;
  // 1. バリデーション
  const existResult = await ensureFileExists(path);
  if (existResult.type === 'error') {
    return existResult;
  }

  const writableResult = await ensureFileWritable(path);
  if (writableResult.type === 'error') {
    return writableResult;
  }

  // 2. 書き込み実行
  try {
    return await performWrite(path, metadata);
  } catch (error: unknown) {
    return toTagResultFailure(error, tagErrors.writeFailed, { path });
  }
};

/**
 * ファイルが存在することを確認します。
 */
const ensureFileExists = async (path: string): Promise<TagResult<void>> => {
  try {
    await fs.access(path);
    return success(undefined);
  } catch (error: unknown) {
    if (hasErrorCode(error, 'ENOENT')) {
      return failure(tagErrors.fileNotFound({ path }));
    }
    return toTagResultFailure(error, tagErrors.writeFailed, { path });
  }
};

/**
 * ファイルが書き込み可能であることを確認します。
 */
const ensureFileWritable = async (path: string): Promise<TagResult<void>> => {
  try {
    await fs.access(path, fs.constants.W_OK);
    return success(undefined);
  } catch (error: unknown) {
    if (hasErrorCode(error, 'EACCES') || hasErrorCode(error, 'EPERM')) {
      return failure(tagErrors.permissionDenied({ path, detail: '(Read-only file)' }));
    }
    return toTagResultFailure(error, tagErrors.writeFailed, { path });
  }
};

/**
 * 書き込み処理の具体的な実行手順。
 */
const performWrite = async (filePath: string, metadata: FlacMetadata): Promise<TagResult<void>> => {
  const rawData = await readRawData(filePath);

  // 書き込み用の最終的な画像を解決（既存維持、削除、更新のいずれか）
  const picture = await resolvePictureForWrite(metadata.picture, rawData);

  const mergedTags = mergeMetadataWithTags(rawData, metadata, picture);
  const tempPath = `${filePath}.tmp`;
  await fs.copyFile(filePath, tempPath, fs.constants.COPYFILE_FICLONE);
  try {
    await writeFlacTags(mergedTags, tempPath);
    await fs.rename(tempPath, filePath);
    return success(undefined);
  } catch (error: unknown) {
    await fs.unlink(tempPath).catch((err) => {
      console.warn(`[Writer] Failed to cleanup temporary file: ${tempPath}`, err);
    });
    throw error;
  }
};
