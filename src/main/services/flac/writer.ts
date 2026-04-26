import { failure, success } from '@domain/common/result';
import { AppResult } from '@domain/flac/types';
import { appErrors } from '@domain/flac/errors';
import { FlacMetadata, FlacTrack } from '@domain/flac/models';
import { writeFlacTags } from 'flac-tagger';
import fs from 'node:fs/promises';
import { hasErrorCode, toAppResultFailure } from '@main/utils/error-handler';
import { withAtomicWrite } from '@main/utils/file-utils';
import { mergeMetadataWithTags } from './mappers/flac-write-mapper';
import { resolvePictureForWrite } from './mappers/flac-write-picture-resolver';
import { readRawData } from './reader';

/**
 * 指定されたパスのFLACファイルへメタデータを書き込みます。
 */
export const writeMetadata = async (track: FlacTrack): Promise<AppResult<void>> => {
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
    await performWrite(path, metadata);
  } catch (error: unknown) {
    return toAppResultFailure(error, appErrors.writeFailed, { path });
  }

  return success(undefined);
};

/**
 * ファイルが存在することを確認します。
 */
const ensureFileExists = async (path: string): Promise<AppResult<void>> => {
  try {
    await fs.access(path);
  } catch (error: unknown) {
    if (hasErrorCode(error, 'ENOENT')) {
      return failure(appErrors.fileNotFound({ path }));
    }
    return toAppResultFailure(error, appErrors.writeFailed, { path });
  }

  return success(undefined);
};

/**
 * ファイルが書き込み可能であることを確認します。
 */
const ensureFileWritable = async (path: string): Promise<AppResult<void>> => {
  try {
    await fs.access(path, fs.constants.W_OK);
  } catch (error: unknown) {
    if (hasErrorCode(error, 'EACCES') || hasErrorCode(error, 'EPERM')) {
      return failure(appErrors.permissionDenied({ path, detail: '(Read-only file)' }));
    }
    return toAppResultFailure(error, appErrors.writeFailed, { path });
  }

  return success(undefined);
};

/**
 * 書き込み処理の具体的な実行手順。
 */
const performWrite = async (filePath: string, metadata: FlacMetadata): Promise<void> => {
  const rawData = await readRawData(filePath);

  // 書き込み用の最終的な画像を解決（既存維持、削除、更新のいずれか）
  const picture = await resolvePictureForWrite(metadata.picture, rawData);

  const mergedTags = mergeMetadataWithTags(rawData, metadata, picture);

  await withAtomicWrite(filePath, async (tempPath) => await writeFlacTags(mergedTags, tempPath));
};
