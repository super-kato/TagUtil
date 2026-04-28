import { success } from '@domain/common/result';
import { appErrors } from '@domain/errors/definitions';
import { AppResult } from '@domain/types';
import { logger } from '@main/infrastructure/logging/logger';
import { scanFiles } from '@main/infrastructure/repositories/file/file-scanner-repository';
import { toAppResultFailure } from '@main/utils/error-handler';
import { isSupportedAudioFile } from '@main/utils/file-utils';
import { ScanResult } from '@shared/flac';

const LOG_CONTEXT = 'ScanDirectory';

/**
 * 指定された複数のパス（ファイルまたはディレクトリ）から、再帰的に .flac ファイルのパスを探索します。
 * @param targetPaths 探索対象のパスの配列
 * @returns 見つかった FLAC ファイルの絶対パスの配列と制限フラグを含むオブジェクト
 */
export const scanDirectory = async (targetPaths: string[]): Promise<AppResult<ScanResult>> => {
  logger.debug({
    context: LOG_CONTEXT,
    message: `Starting to scan: ${targetPaths.join(', ')}`
  });
  try {
    const result = await scanFiles(targetPaths, (name) => isSupportedAudioFile(name));
    logger.debug({
      context: LOG_CONTEXT,
      message: `Scan completed: found ${result.paths.length} files`
    });
    return success(result);
  } catch (error: unknown) {
    const representativePath = targetPaths[0] ?? '';
    return toAppResultFailure(error, appErrors.scanFailed, { path: representativePath });
  }
};
