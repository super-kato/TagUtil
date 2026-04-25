/**
 * Electron/Node.jsのパス操作APIをRendererプロセスから利用するためのアダプター。
 */

/**
 * フルパスからディレクトリ名を抽出します。
 * @param path 対象のフルパス
 * @returns ディレクトリパス
 */
export const getDirectoryName = async (path: string): Promise<string> => {
  return await window.api.path.dirname(path);
};

/**
 * ディレクトリパスとファイル名を結合します。
 * @param dir ディレクトリパス
 * @param filename ファイル名
 * @returns 結合されたフルパス
 */
export const joinPath = async (dir: string, filename: string): Promise<string> => {
  return await window.api.path.join(dir, filename);
};
