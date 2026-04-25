/**
 * ドラッグ＆ドロップイベントから必要なプロパティだけを定義。
 */
export interface DropEventLike {
  readonly dataTransfer: {
    readonly files: FileList | File[];
  } | null;
}

/**
 * ドラッグ＆ドロップイベントから、ドロップされたすべての項目の OS 絶対パスを抽出します。
 * Electron特有の webUtils.getPathForFile (window.api経由) を使用します。
 */
export const getAllPathsFromDropEvent = (e: DropEventLike): string[] => {
  const files = e.dataTransfer?.files;
  if (!files || files.length === 0) {
    return [];
  }
  return Array.from(files)
    .map((file) => window.api.getPathForFile(file))
    .filter((path): path is string => !!path);
};
