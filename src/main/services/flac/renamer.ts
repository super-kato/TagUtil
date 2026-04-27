import { success } from '@domain/common/result';
import { appErrors } from '@domain/errors/definitions';
import { formatFilename } from '@domain/audio/filename-formatter';
import type { FlacTrack } from '@domain/flac/models';
import { AppResult } from '@domain/types';

import { renameFileExclusive } from '@main/infrastructure/repositories/file/file-rename-repository';
import { resolveNewPath } from '@main/infrastructure/repositories/file/file-path-repository';
import { settingsRepository } from '@main/infrastructure/repositories/settings/settings-repository';
import { toAppResultFailure } from '@main/utils/error-handler';

/**
 * ファイルを新しいパスにリネーム（移動）します。
 * @param oldPath 現在の絶対パス
 * @param newPath 新しい絶対パス
 */
export const renameFile = async (oldPath: string, newPath: string): Promise<AppResult<void>> => {
  try {
    await renameFileExclusive(oldPath, newPath);
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
  const filenameResult = formatFilename(track, {
    pattern: renamePattern,
    trackNumberPadding
  });

  if (filenameResult.type === 'error') {
    return filenameResult;
  }

  const newPath = resolveNewPath(track.path, filenameResult.value);
  return success(newPath);
};
