import { PathType, ResolvedPath } from '@domain/common/system';
import { Dirent, Stats } from 'node:fs';
import { stat } from 'node:fs/promises';
import { isHiddenPath, isSupportedAudioFile } from '@main/utils/file-utils';

/**
 * 指定された複数のパスの種別（ファイル/ディレクトリ）を一括判定します。
 */
export const resolvePaths = async (targetPaths: string[]): Promise<ResolvedPath[]> => {
  return Promise.all(targetPaths.map(resolveSinglePath));
};

/**
 * 名前（またはパス）とステータス情報から、扱うべきパス種別を判定します。
 * 隠しパス（ドットで始まる）は一律 'unknown' として扱われます。
 *
 * @param name 判定対象の名前またはパス
 * @param stats fs.Stats または fs.Dirent 互換のオブジェクト
 */
export const determinePathType = (name: string, stats: Stats | Dirent): PathType => {
  if (isHiddenPath(name)) {
    return 'unknown';
  }

  if (stats.isDirectory()) {
    return 'directory';
  }

  if (stats.isFile() && isSupportedAudioFile(name)) {
    return 'file';
  }

  return 'unknown';
};

/**
 * 単独のパスの種別を判定します（内部用）。
 */
const resolveSinglePath = async (targetPath: string): Promise<ResolvedPath> => {
  try {
    const pathStat = await stat(targetPath);
    const type = determinePathType(targetPath, pathStat);
    return { path: targetPath, type };
  } catch {
    return { path: targetPath, type: 'unknown' };
  }
};
