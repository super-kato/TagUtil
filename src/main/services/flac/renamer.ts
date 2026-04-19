import { success } from '@domain/common/result';
import { tagErrors, TagResult } from '@domain/flac/types';
import fs from 'fs/promises';
import { toTagResultFailure } from '../../utils/error-handler';
import { ensureFileExists } from '../../utils/fs';

/**
 * ファイルを新しいパスにリネーム（移動）します。
 * @param oldPath 現在の絶対パス
 * @param newPath 新しい絶対パス
 */
export const renameFile = async (oldPath: string, newPath: string): Promise<TagResult<void>> => {
  if (oldPath === newPath) {
    return success(undefined);
  }

  if (await isDestinationOccupied(oldPath, newPath)) {
    return success(undefined);
  }

  try {
    await fs.rename(oldPath, newPath);
  } catch (error: unknown) {
    return toTagResultFailure(error, tagErrors.writeFailed, { path: oldPath });
  }

  return success(undefined);
};

/**
 * リネーム先が他のファイルによって占有されている（＝スキップすべき）かどうかを判定します。
 */
const isDestinationOccupied = async (oldPath: string, newPath: string): Promise<boolean> => {
  try {
    await ensureFileExists(newPath);
  } catch {
    // ファイルが存在しない場合は占有されていないとみなす
    return false;
  }

  // 既にファイルが存在する場合、それが自分自身（大文字小文字違い含む）でなければ「占有されている」と判定
  return oldPath.toLowerCase() !== newPath.toLowerCase();
};
