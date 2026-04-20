import type { TagResult } from '@domain/flac/types';

/**
 * 物理的なファイル操作（リネームなど）を担当するリポジトリ。
 */
const renameFile = async (oldPath: string, newPath: string): Promise<TagResult<void>> => {
  return await window.api.renameFile(oldPath, newPath);
};

export const fileRepository = {
  renameFile
} as const;
