import { computeMd5 } from '@main/utils/crypto';
import { link, readFile, rename, stat, unlink } from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';
import { FileContent } from './repository-types';

/**
 * ファイルをバイナリとして読み込み、データとハッシュ値を返します。
 */
export const readFileWithHash = async (filePath: string): Promise<FileContent> => {
  const buffer = await readFile(filePath);
  return {
    buffer,
    hash: computeMd5(buffer)
  };
};

/**
 * 現在のパスと同じディレクトリ、同じ拡張子を維持したまま、新しいファイル名でフルパスを構成します。
 * @param currentPath 現在のフルパス
 * @param newBaseName 新しいファイル名（拡張子なし）
 */
export const resolveNewPath = (currentPath: string, newBaseName: string): string => {
  const dir = dirname(currentPath);
  const ext = extname(currentPath);
  return join(dir, newBaseName + ext);
};

/**
 * ファイルを安全に（上書きせず）リネームします。
 *
 * 以下の戦略で順次リネームを試みます：
 * 1. 同一パスの場合は何もしない。
 * 2. 大文字小文字のみの変更の場合は直接リネームを実行する。
 * 3. ハードリンクを利用して、アトミックに「移動先の不在確認と移動」を試行する。
 * 4. 上記が使えない環境では、フォールバックとして存在確認後にリネームを実行する。
 */
export const renameFileExclusive = async (oldPath: string, newPath: string): Promise<void> => {
  if (oldPath === newPath) {
    return;
  }

  if (await tryRenameCaseOnly(oldPath, newPath)) {
    return;
  }

  if (await tryRenameByLinking(oldPath, newPath)) {
    return;
  }

  await tryRenameWithStatCheck(oldPath, newPath);
};

/**
 * 大文字小文字のみの変更である場合に、直接リネームを試行します。
 * @returns 該当するケースで実行された場合は true、そうでなければ false
 */
const tryRenameCaseOnly = async (oldPath: string, newPath: string): Promise<boolean> => {
  if (oldPath.toLowerCase() !== newPath.toLowerCase()) {
    return false;
  }
  await rename(oldPath, newPath);
  return true;
};

/**
 * ハードリンクを利用したアトミックなリネームを試行します。
 *
 * 移動先が存在すれば `EEXIST` エラーをスローし、
 * システム制限（FAT32/exFAT等）やクロスデバイスエラー等で試行できなかった場合は `false` を返します。
 */
const tryRenameByLinking = async (oldPath: string, newPath: string): Promise<boolean> => {
  try {
    await link(oldPath, newPath);
    await unlink(oldPath);
    return true;
  } catch (error: unknown) {
    if (isAlreadyExistsError(error)) {
      throw error;
    }
    return false;
  }
};

/**
 * stat による存在チェックを行ってからリネームを実行します（フォールバック用）。
 *
 * `stat` で存在を確認し、既にファイルがあれば `EEXIST` エラーをスローします。
 * 存在しないことが確認できれば `rename` を実行します（この際、理論上の TOCTOU は許容されます）。
 */
const tryRenameWithStatCheck = async (oldPath: string, newPath: string): Promise<void> => {
  try {
    await stat(newPath);
  } catch (e: unknown) {
    if (!isNotFoundError(e)) {
      throw e;
    }
    await rename(oldPath, newPath);
    return;
  }

  const existErr = new Error('File already exists');
  throw existErr;
};

/**
 * 指定されたエラーが「ファイルが既に存在する (EEXIST)」エラーであるか判定します。
 */
const isAlreadyExistsError = (error: unknown): error is { code: string } => {
  return (error as { code?: string }).code === 'EEXIST';
};

/**
 * 指定されたエラーが「ファイルが見つからない (ENOENT)」エラーであるか判定します。
 */
const isNotFoundError = (error: unknown): error is { code: string } => {
  return (error as { code?: string }).code === 'ENOENT';
};
