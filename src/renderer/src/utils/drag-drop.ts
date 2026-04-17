/**
 * ドラッグ＆ドロップイベントから必要なプロパティだけを定義。
 * e.dataTransfer.files は FileList ですが、これは ArrayLike<File> を満たすため
 * テストなどで File[] を渡すことも可能です。
 */
export interface DropEventLike {
  readonly dataTransfer: {
    readonly files: FileList | File[];
  } | null;
}

/**
 * ドラッグ＆ドロップイベントから、ドロップされたすべての項目の OS 絶対パスを抽出します。
 * Electron v28+ では File.path が廃止されたため、webUtils.getPathForFile を使用します。
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
