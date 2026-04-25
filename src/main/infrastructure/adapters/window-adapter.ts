import { BrowserWindow } from 'electron';

/**
 * 現在アクティブなすべてのウィンドウ（破棄されていないもの）に対して、
 * 指定したチャンネルでデータを送信します。
 */
const sendToAllWindows = (channel: string, data: unknown): void => {
  const windows = BrowserWindow.getAllWindows();
  for (const window of windows) {
    if (!window.isDestroyed()) {
      window.webContents.send(channel, data);
    }
  }
};

/**
 * Electron のウィンドウ操作に関する物理的な実装を担当するアダプター。
 */
export const windowAdapter = {
  sendToAllWindows
} as const;
