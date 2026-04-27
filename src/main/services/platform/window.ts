import { BrowserWindow, type WebContents } from 'electron';

/**
 * 送信元の WebContents に紐づくウィンドウ（メインウィンドウ）を表示します。
 * @param webContents 表示対象の WebContents
 */
export const showMainWindow = (webContents: WebContents): void => {
  const window = BrowserWindow.fromWebContents(webContents);
  if (!window) {
    return;
  }
  window.show();
};
