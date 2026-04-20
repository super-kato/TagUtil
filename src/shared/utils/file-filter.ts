/**
 * ファイルパスの配列から、指定された拡張子を持つもののみを抽出します。
 * @param paths ファイルパスの配列
 * @param extensions 許可する拡張子の配列（例: ['.jpg', '.png']）
 * @returns フィルタリングされたパスの配列
 */
export const filterByExtensions = (paths: string[], extensions: readonly string[]): string[] => {
  return paths.filter((path) => hasExtension(path, extensions));
};

/**
 * 指定されたパスが、指定された拡張子のいずれかを持つか判定します。
 * @param path ファイルパス
 * @param extensions 許可する拡張子の配列
 */
export const hasExtension = (path: string, extensions: readonly string[]): boolean => {
  const lowerPath = path.toLowerCase();
  return extensions.some((ext) => lowerPath.endsWith(ext.toLowerCase()));
};
