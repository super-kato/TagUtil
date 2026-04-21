import { success } from '@domain/common/result';
import { ResolvedPath } from '@domain/common/system';
import { ScanResult, tagErrors, TagResult } from '@domain/flac/types';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { toTagResultFailure } from '@main/utils/error-handler';
import { determinePathType, resolvePaths } from './path-resolver';

/**
 * スキャンするファイルの最大件数。
 * パフォーマンスとメモリの観点から制限を設けます。
 */
const MAX_SCAN_FILES = 500;

/**
 * 探索処理の状態を管理するコンテキスト。
 */
interface ScanContext {
  paths: string[];
  isLimited: boolean;
}

/**
 * 指定された複数のパス（ファイルまたはディレクトリ）から、再帰的に .flac ファイルのパスを探索します。
 * @param targetPaths 探索対象のパスの配列
 * @returns 見つかった FLAC ファイルの絶対パスの配列と制限フラグを含むオブジェクト
 */
export const scanDirectory = async (targetPaths: string[]): Promise<TagResult<ScanResult>> => {
  try {
    const result = await collectTracksFromPaths(targetPaths);
    return success({ paths: formatResultPaths(result.paths), isLimited: result.isLimited });
  } catch (error: unknown) {
    const representativePath = targetPaths[0] ?? '';
    return toTagResultFailure(error, tagErrors.scanFailed, { path: representativePath });
  }
};

/**
 * 与えられた複数のルートパスから、条件に合うファイルを収集します（内部用）。
 */
const collectTracksFromPaths = async (targetPaths: string[]): Promise<ScanResult> => {
  const resolved = await resolvePaths(targetPaths);
  const context: ScanContext = { paths: [], isLimited: false };
  for (const item of resolved) {
    if (item.type === 'unknown') {
      continue;
    }
    if (await processScanEntry(item, context)) {
      break;
    }
  }
  return context;
};

/**
 * 指定されたエントリ（ファイルまたはディレクトリ）を再帰的に処理します（内部用）。
 * @param item 処理対象のエントリ
 * @param context 探索状態のコンテキスト
 * @returns 上限に達した場合は true、それ以外は false
 */
const processScanEntry = async (item: ResolvedPath, context: ScanContext): Promise<boolean> => {
  // すでに上限に達している場合は何もしない
  if (context.isLimited) {
    return true;
  }
  if (item.type === 'unknown') {
    return false;
  }
  if (item.type === 'file') {
    return processFileEntry(item.path, context);
  }
  return processDirectoryEntry(item.path, context);
};

/**
 * 単独のファイルをプロセスに追加し、上限を確認します（内部用）。
 */
const processFileEntry = (path: string, context: ScanContext): boolean => {
  context.paths.push(path);
  if (context.paths.length >= MAX_SCAN_FILES) {
    context.isLimited = true;
    return true;
  }
  return false;
};

/**
 * ディレクトリ内の各エントリを走査します（内部用）。
 */
const processDirectoryEntry = async (dirPath: string, context: ScanContext): Promise<boolean> => {
  const entries = await readdir(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const type = determinePathType(entry.name, entry);
    if (type === 'unknown') {
      continue;
    }
    const path = join(dirPath, entry.name);
    if (await processScanEntry({ path, type }, context)) {
      return true;
    }
  }
  return false;
};

/**
 * 結果となるパス一覧の加工（重複排除とソート）。
 */
const formatResultPaths = (paths: string[]): string[] => {
  return Array.from(new Set(paths)).sort();
};
