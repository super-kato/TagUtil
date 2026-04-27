import { success } from '@domain/common/result';
import { AppResult } from '@domain/flac/types';
import { ScanResult } from '@shared/flac';
import { appErrors } from '@domain/flac/errors';
import { toAppResultFailure } from '@main/utils/error-handler';
import { isSupportedAudioFile } from '@main/utils/file-utils';
import { scanFiles } from '@main/infrastructure/repositories/file/file-scanner-repository';

/**
 * 指定された複数のパス（ファイルまたはディレクトリ）から、再帰的に .flac ファイルのパスを探索します。
 * @param targetPaths 探索対象のパスの配列
 * @returns 見つかった FLAC ファイルの絶対パスの配列と制限フラグを含むオブジェクト
 */
export const scanDirectory = async (targetPaths: string[]): Promise<AppResult<ScanResult>> => {
  try {
    const result = await scanFiles(targetPaths, (name) => isSupportedAudioFile(name));
    return success(result);
  } catch (error: unknown) {
    const representativePath = targetPaths[0] ?? '';
    return toAppResultFailure(error, appErrors.scanFailed, { path: representativePath });
  }
};
