import fs from 'fs/promises';

/**
 * 対象のパスが存在することを保証します。存在しない場合は例外をスローします。
 * @param path 対象のパス
 */
export const ensureFileExists = async (path: string): Promise<void> => {
  try {
    await fs.access(path);
  } catch {
    throw new Error(`File not found: ${path}`);
  }
};
