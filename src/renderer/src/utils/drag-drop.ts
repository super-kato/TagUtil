/**
 * ドラッグ＆ドロップイベントから、ドロップされたすべての項目の OS 絶対パスを抽出します。
 * Electron v28+ では File.path が廃止されたため、webUtils.getPathForFile を使用します。
 */
export const getAllPathsFromDropEvent = (e: DragEvent): string[] => {
  if (!e.dataTransfer?.files || e.dataTransfer.files.length === 0) {
    return [];
  }
  return Array.from(e.dataTransfer.files)
    .map((file) => window.api.getPathForFile(file))
    .filter((path): path is string => !!path);
};
