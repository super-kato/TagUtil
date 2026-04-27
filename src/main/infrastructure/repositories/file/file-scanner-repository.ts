import { PathType, ResolvedPath } from '@domain/common/system';
import { ScanResult } from '@shared/flac';
import { isHiddenPath } from '@main/utils/file-utils';
import { Dirent, Stats } from 'node:fs';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * スキャンするファイルの最大件数。
 */
const MAX_SCAN_FILES = 300;

/**
 * ファイルフィルタの型定義
 */
export type FileFilter = (path: string) => boolean;

/**
 * 指定された条件に合致するファイルを再帰的に探索します。
 * @param targetPaths 探索対象のパス
 * @param isFileIncluded ファイルを含めるかどうかの判定関数
 */
export const scanFiles = async (
  targetPaths: string[],
  isFileIncluded: FileFilter
): Promise<ScanResult> => {
  const resolved = await Promise.all(targetPaths.map((p) => resolveSinglePath(p, isFileIncluded)));
  const context: { paths: string[]; isLimited: boolean } = { paths: [], isLimited: false };

  for (const item of resolved) {
    if (item.type === 'unknown') {
      continue;
    }
    if (await processScanEntry(item, context, isFileIncluded)) {
      break;
    }
  }

  return {
    paths: Array.from(new Set(context.paths)).sort(),
    isLimited: context.isLimited
  };
};

/**
 * 単独のパスの種別を判定します。
 */
const resolveSinglePath = async (
  targetPath: string,
  isFileIncluded: FileFilter
): Promise<ResolvedPath> => {
  try {
    const pathStat = await stat(targetPath);
    const type = determinePathType(targetPath, pathStat, isFileIncluded);
    return { path: targetPath, type };
  } catch {
    return { path: targetPath, type: 'unknown' };
  }
};

/**
 * 名前とステータス情報からパス種別を判定します。
 */
const determinePathType = (
  path: string,
  stats: Stats | Dirent,
  isFileIncluded: FileFilter
): PathType => {
  if (isHiddenPath(path)) {
    return 'unknown';
  }
  if (stats.isDirectory()) {
    return 'directory';
  }
  if (stats.isFile() && isFileIncluded(path)) {
    return 'file';
  }
  return 'unknown';
};

/**
 * エントリを再帰的に処理します。
 */
const processScanEntry = async (
  item: ResolvedPath,
  context: { paths: string[]; isLimited: boolean },
  isFileIncluded: FileFilter
): Promise<boolean> => {
  if (context.isLimited) {
    return true;
  }
  if (item.type === 'file') {
    context.paths.push(item.path);
    if (context.paths.length >= MAX_SCAN_FILES) {
      context.isLimited = true;
      return true;
    }
    return false;
  }

  if (item.type !== 'directory') {
    return false;
  }

  const entries = await readdir(item.path, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(item.path, entry.name);
    const type = determinePathType(fullPath, entry, isFileIncluded);
    if (type === 'unknown') {
      continue;
    }
    if (await processScanEntry({ path: fullPath, type }, context, isFileIncluded)) {
      return true;
    }
  }

  return false;
};
