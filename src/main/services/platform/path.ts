import path from 'path';

/**
 * ディレクトリ名を取得します。
 */
export const getDirname = (p: string): string => {
  return path.dirname(p);
};

/**
 * パスを結合します。
 */
export const joinPaths = (...paths: string[]): string => {
  return path.join(...paths);
};
