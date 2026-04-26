import { success } from '@domain/common/result';
import { AppResult } from '@domain/flac/types';
import { appErrors } from '@domain/flac/errors';
import type { FlacTrack } from '@domain/flac/models';
import { formatFlacFilename } from '@domain/flac/filename-formatter';
import path from 'path';
import fs from 'fs/promises';
import { toAppResultFailure } from '@main/utils/error-handler';
import { ensureFileExists } from '@main/utils/fs';
import { settingsRepository } from '@main/infrastructure/repositories/settings-repository';

/**
 * ファイルを新しいパスにリネーム（移動）します。
 * @param oldPath 現在の絶対パス
 * @param newPath 新しい絶対パス
 */
export const renameFile = async (oldPath: string, newPath: string): Promise<AppResult<void>> => {
  if (oldPath === newPath) {
    return success(undefined);
  }

  if (await isDestinationOccupied(oldPath, newPath)) {
    return success(undefined);
  }

  try {
    await fs.rename(oldPath, newPath);
  } catch (error: unknown) {
    return toAppResultFailure(error, appErrors.writeFailed, { path: oldPath });
  }

  return success(undefined);
};

/**
 * トラックのメタデータに基づいて、リネーム後のフルパスを算出します。
 * @param track トラック情報
 */
export const resolveRenamedPath = (track: FlacTrack): AppResult<string> => {
  const { renamePattern, trackNumberPadding } = settingsRepository.settings;
  const filenameResult = formatFlacFilename(track, {
    pattern: renamePattern,
    trackNumberPadding
  });
  if (filenameResult.type === 'error') {
    return filenameResult;
  }
  const dir = path.dirname(track.path);
  const ext = path.extname(track.path);
  const newPath = path.join(dir, filenameResult.value + ext);
  return success(newPath);
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
