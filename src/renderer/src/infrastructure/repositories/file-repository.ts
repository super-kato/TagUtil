import type { TagResult } from '@domain/flac/types';

/**
 * 物理的なファイル操作（リネームなど）を担当するリポジトリ。
 */
const renameFile = async (oldPath: string, newPath: string): Promise<TagResult<void>> => {
  return await window.api.renameFile(oldPath, newPath);
};

/**
 * File オブジェクトから OS 上のファイルシステムパスを取得します。
 */
const getPathForFile = (file: File): string => {
  return window.api.getPathForFile(file);
};

export const fileRepository = {
  renameFile,
  getPathForFile
} as const;
