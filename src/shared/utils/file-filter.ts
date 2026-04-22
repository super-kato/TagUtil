/**
 * 指定されたパスが、指定された拡張子のいずれかを持つか判定します。
 * @param path ファイルパス
 * @param extensions 許可する拡張子の配列（例: ['.jpg', '.png']）
 */
export const hasExtension = (path: string, extensions: readonly string[]): boolean => {
  const lowerPath = path.toLowerCase();
  return extensions.some((ext) => lowerPath.endsWith(ext.toLowerCase()));
};
