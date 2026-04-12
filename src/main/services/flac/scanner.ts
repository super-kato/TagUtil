import { success } from '@domain/common/result';
import { ScanResult, tagErrors, TagResult } from '@domain/flac/types';
import { readdir } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { toTagResultFailure } from '../../utils/error-handler';

/**
 * スキャンするファイルの最大件数。
 * パフォーマンスとメモリの観点から制限を設けます。
 */
const MAX_SCAN_FILES = 500;

/**
 * 指定されたディレクトリから、再帰的に .flac ファイルのパスを探索します。
 * @param dirPath 探索対象のディレクトリパス
 * @returns 見つかった FLAC ファイルの絶対パスの配列と制限フラグを含むオブジェクト
 */
export const scanDirectory = async (dirPath: string): Promise<TagResult<ScanResult>> => {
  try {
    const paths: string[] = [];
    const isLimited = await performScan(dirPath, paths);
    return success({
      paths: paths.sort(),
      isLimited
    });
  } catch (error: unknown) {
    return toTagResultFailure(error, tagErrors.scanFailed, { path: dirPath });
  }
};

/**
 * 再帰的なスキャンの実行実体
 * @returns 上限に達して打ち切られた場合は true
 */
const performScan = async (dirPath: string, accumulator: string[]): Promise<boolean> => {
  // すでに上限に達している場合は探索しない
  if (accumulator.length >= MAX_SCAN_FILES) {
    return true;
  }

  const items = await readdir(dirPath, { withFileTypes: true });

  for (const item of items) {
    if (item.name.startsWith('.')) {
      continue;
    }

    const fullPath = join(dirPath, item.name);

    if (item.isDirectory()) {
      const isLimited = await performScan(fullPath, accumulator);
      if (isLimited) {
        return true;
      }
      continue;
    }

    if (!item.isFile()) {
      continue;
    }

    if (extname(item.name).toLowerCase() === '.flac') {
      accumulator.push(fullPath);
      // ファイル追加直後に上限チェック
      if (accumulator.length >= MAX_SCAN_FILES) {
        return true;
      }
    }
  }

  return false;
};
