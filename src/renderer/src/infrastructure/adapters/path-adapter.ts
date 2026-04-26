import type { AppResult } from '@domain/flac/types';
import type { FlacTrack } from '@domain/flac/models';

/**
 * Electron/Node.jsのパス操作APIをRendererプロセスから利用するためのアダプター。
 */

/**
 * メタデータに基づいて新しいファイルパスを生成します。
 * @param track トラック情報
 * @returns 生成された新しいフルパス
 */
export const generateNewPath = async (track: FlacTrack): Promise<AppResult<string>> => {
  return await window.api.generateNewPath(track);
};
