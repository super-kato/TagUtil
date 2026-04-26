import type { FlacTrack, TagResult } from '@domain/flac/types';

/**
 * Electron/Node.jsのパス操作APIをRendererプロセスから利用するためのアダプター。
 */

/**
 * メタデータに基づいて新しいファイルパスを生成します。
 * @param track トラック情報
 * @returns 生成された新しいフルパス
 */
export const generateNewPath = async (track: FlacTrack): Promise<TagResult<string>> => {
  return await window.api.generateNewPath(track);
};
