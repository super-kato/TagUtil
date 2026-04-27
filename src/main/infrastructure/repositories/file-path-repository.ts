import { app } from 'electron';
import { dirname, extname, join } from 'node:path';

/**
 * アプリケーションリソースのパスを取得します。
 */
export const getAppResourcePath = (...parts: string[]): string => {
  return join(app.getAppPath(), ...parts);
};

/**
 * 現在のパスと同じディレクトリ、同じ拡張子を維持したまま、新しいファイル名でフルパスを構成します。
 * @param currentPath 現在のフルパス
 * @param newBaseName 新しいファイル名（拡張子なし）
 */
export const resolveNewPath = (currentPath: string, newBaseName: string): string => {
  const dir = dirname(currentPath);
  const ext = extname(currentPath);
  return join(dir, newBaseName + ext);
};
