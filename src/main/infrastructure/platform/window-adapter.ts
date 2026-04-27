import { BrowserWindow, WebContents } from 'electron';

/**
 * 現在アクティブなすべてのウィンドウ（破棄されていないもの）に対して、
 * 指定したチャンネルでデータを送信します。
 */
const sendToAllWindows = (channel: string, data: unknown): void => {
  const windows = BrowserWindow.getAllWindows();
  for (const window of windows) {
    if (window.isDestroyed()) {
      continue;
    }
    window.webContents.send(channel, data);
  }
};

/**
 * 送信元の WebContents に紐づくウィンドウ（メインウィンドウ）を表示します。
 * @param webContents 表示対象の WebContents
 */
const showMainWindow = (webContents: WebContents): void => {
  const window = BrowserWindow.fromWebContents(webContents);
  if (!window) {
    return;
  }
  window.show();
};

/**
 * Electron のウィンドウ操作に関する物理的な実装を担当するアダプター。
 */
export const windowAdapter = {
  sendToAllWindows,
  showMainWindow
} as const;
