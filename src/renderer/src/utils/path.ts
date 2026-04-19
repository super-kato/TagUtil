/**
 * フルパスからディレクトリ名を抽出します。
 * @param path 対象のフルパス
 * @returns ディレクトリパス
 */
export const getDirectoryName = (path: string): string => {
  return window.api.path.dirname(path);
};

/**
 * ディレクトリパスとファイル名を結合します。
 * @param dir ディレクトリパス
 * @param filename ファイル名
 * @returns 結合されたフルパス
 */
export const joinPath = (dir: string, filename: string): string => {
  return window.api.path.join(dir, filename);
};
