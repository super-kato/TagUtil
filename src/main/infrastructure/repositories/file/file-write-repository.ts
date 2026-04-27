import { copyFile, constants, rename, unlink } from 'node:fs/promises';

/**
 * アトミックなファイル書き込みを提供します。
 * 元のファイルを一時ファイルにコピーし、task を実行し、成功すればリネーム、失敗すれば削除します。
 */
export const withAtomicWrite = async (
  targetPath: string,
  task: (tempPath: string) => Promise<void>
): Promise<void> => {
  const tempPath = `${targetPath}.tmp`;

  // 元のファイルを一時ファイルにコピー（可能であれば FICLONE を使用）
  await copyFile(targetPath, tempPath, constants.COPYFILE_FICLONE);

  try {
    await task(tempPath);
    // 成功した場合は一時ファイルを元のパスにリネーム（上書き）
    await rename(tempPath, targetPath);
  } catch (error: unknown) {
    // 失敗した場合は一時ファイルを削除（ここでの失敗も呼び出し側へ伝播する）
    await unlink(tempPath);
    throw error;
  }
};
