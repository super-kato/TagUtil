/**
 * Electron/Node.jsのパス操作APIをRendererプロセスから利用するためのアダプター。
 */

/**
 * フルパスからディレクトリ名を抽出します。
 * @param path 対象のフルパス
 * @returns ディレクトリパス
 */
export const getDirectoryName = (path: string): string => {
  const lastIndex = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'));
  const NOT_FOUND = -1;
  const ROOT_INDEX = 0;
  const WINDOWS_DRIVE_SEP_INDEX = 2;
  const WINDOWS_ROOT_LENGTH = 3;

  if (lastIndex === NOT_FOUND) {
    return '.';
  }
  // ルートディレクトリの場合（/ または C:\ など）
  if (lastIndex === ROOT_INDEX) {
    return path[0];
  }
  // Windowsのドライブレター直下（C:\）の対応
  if (lastIndex === WINDOWS_DRIVE_SEP_INDEX && path[1] === ':') {
    return path.substring(0, WINDOWS_ROOT_LENGTH);
  }
  return path.substring(0, lastIndex);
};

/**
 * ディレクトリパスとファイル名を結合します。
 * @param dir ディレクトリパス
 * @param filename ファイル名
 * @returns 結合されたフルパス
 */
export const joinPath = (dir: string, filename: string): string => {
  const separator = dir.includes('\\') ? '\\' : '/';
  const lastCharIndex = dir.length - 1;
  const cleanDir = dir.endsWith('/') || dir.endsWith('\\') ? dir.slice(0, lastCharIndex) : dir;
  return `${cleanDir}${separator}${filename}`;
};
