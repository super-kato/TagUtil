import { ResolvedPath } from '@domain/common/system';
import { Stats } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname } from 'node:path';

/**
 * 指定された複数のパスの種別（ファイル/ディレクトリ）を一括判定します。
 * @param targetPaths 判定対象のパス配列
 * @returns 判定結果（ResolvedPath[]）の配列
 */
export const resolvePaths = async (targetPaths: string[]): Promise<ResolvedPath[]> => {
  return Promise.all(targetPaths.map(resolveSinglePath));
};

/**
 * 単独のパスの種別を判定します（内部用）。
 */
const resolveSinglePath = async (targetPath: string): Promise<ResolvedPath> => {
  let pathStat: Stats | undefined;
  try {
    pathStat = await stat(targetPath);
  } catch {
    return { path: targetPath, type: 'unknown' };
  }

  if (pathStat.isFile()) {
    // 拡張子が .flac の場合のみ 'file' として扱う
    if (extname(targetPath).toLowerCase() === '.flac') {
      return { path: targetPath, type: 'file' };
    }
    return { path: targetPath, type: 'unknown' };
  }

  if (pathStat.isDirectory()) {
    return { path: targetPath, type: 'directory' };
  }
  return { path: targetPath, type: 'unknown' };
};
