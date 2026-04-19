import { failure, success } from '@domain/common/result';
import { FlacMetadata, FlacTrack, TagResult, tagErrors } from '@domain/flac/types';
import { writeFlacTags } from 'flac-tagger';
import fs from 'node:fs/promises';
import { hasErrorCode, toTagResultFailure } from '../../utils/error-handler';
import { withAtomicWrite } from '../../utils/file-utils';
import { mergeMetadataWithTags } from './mappers/flac-write-mapper';
import { resolvePictureForWrite } from './mappers/flac-write-picture-resolver';
import { readRawData } from './reader';

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
    await performWrite(path, metadata);
  } catch (error: unknown) {
    return toTagResultFailure(error, tagErrors.writeFailed, { path });
  }

  return success(undefined);
};

/**
 * ファイルが存在することを確認します。
 */
const ensureFileExists = async (path: string): Promise<TagResult<void>> => {
  try {
    await fs.access(path);
  } catch (error: unknown) {
    if (hasErrorCode(error, 'ENOENT')) {
      return failure(tagErrors.fileNotFound({ path }));
    }
    return toTagResultFailure(error, tagErrors.writeFailed, { path });
  }

  return success(undefined);
};

/**
 * ファイルが書き込み可能であることを確認します。
 */
const ensureFileWritable = async (path: string): Promise<TagResult<void>> => {
  try {
    await fs.access(path, fs.constants.W_OK);
  } catch (error: unknown) {
    if (hasErrorCode(error, 'EACCES') || hasErrorCode(error, 'EPERM')) {
      return failure(tagErrors.permissionDenied({ path, detail: '(Read-only file)' }));
    }
    return toTagResultFailure(error, tagErrors.writeFailed, { path });
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
