import { SUPPORTED_AUDIO_EXTENSIONS } from '@domain/file-extensions';
import { basename, extname } from 'node:path';
import fs from 'node:fs/promises';

/**
 * 指定されたパスが隠しファイル（ドットで始まる）かどうかを判定します。
 */
export const isHiddenPath = (path: string): boolean => {
  return basename(path).startsWith('.');
};

/**
 * 指定されたパスがサポートされている形式（現在は FLAC）かどうかを判定します。
 */
export const isSupportedAudioFile = (path: string): boolean => {
  return SUPPORTED_AUDIO_EXTENSIONS.includes(extname(path).toLowerCase());
};

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
  await fs.copyFile(targetPath, tempPath, fs.constants.COPYFILE_FICLONE);

  try {
    await task(tempPath);
    // 成功した場合は一時ファイルを元のパスにリネーム（上書き）
    await fs.rename(tempPath, targetPath);
  } catch (error: unknown) {
    // 失敗した場合は一時ファイルを削除（ここでの失敗も呼び出し側へ伝播する）
    await fs.unlink(tempPath);
    throw error;
  }
};

