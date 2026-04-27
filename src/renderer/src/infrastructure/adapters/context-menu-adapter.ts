/**
 * トラック行のコンテキストメニューを表示します。
 * @param path 対象ファイルの絶対パス
 */
const showTrackContextMenu = async (path: string): Promise<void> => {
  await window.api.showTrackContextMenu(path);
};

/**
 * コンテキストメニューの表示を制御するアダプター。
 * Electron IPC経由でメインプロセスのサービスと通信します。
 */
export const contextMenuAdapter = {
  showTrackContextMenu
} as const;
