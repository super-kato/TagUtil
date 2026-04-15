import { app, BrowserWindow, dialog, nativeImage } from 'electron';
import { readFileSync } from 'fs';
import { join } from 'path';
import pkg from '../../../../package.json';
import iconPath from '../../../../resources/icon.png?asset';

/**
 * 「このアプリについて」ダイアログを表示します。
 */
export const showAboutWindow = (): void => {
  const icon = nativeImage.createFromPath(iconPath);

  const result = dialog.showMessageBoxSync({
    type: 'info',
    title: 'About TagUtil',
    message: 'TagUtil',
    detail:
      `Version: ${pkg.version}\n` +
      `Electron: ${process.versions.electron}\n` +
      `Chrome: ${process.versions.chrome}\n` +
      `Node.js: ${process.versions.node}\n\n` +
      `Copyright (c) 2026 super-kato\n` +
      `https://github.com/super-kato/TagUtil`,
    buttons: ['OK', 'Acknowledgements'],
    defaultId: 0,
    cancelId: 0,
    icon
  });

  // Acknowledgements ボタンが押された場合
  if (result === 1) {
    const licensesPath = join(app.getAppPath(), 'resources/licenses.json');
    let creditsText = '';
    try {
      const credits = JSON.parse(readFileSync(licensesPath, 'utf8')) as string[];
      creditsText = credits.join('\n');
    } catch {
      creditsText = 'Failed to load';
    }

    const licenseWindow = new BrowserWindow({
      width: 600,
      height: 480,
      title: 'Acknowledgements',
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
    });

    // プレーンテキストとして流し込む（スクロール可能）
    const html = `
      <html>
        <body style="font-family: sans-serif; font-size: 13px; line-height: 1.5; padding: 20px; background: #f5f5f5;">
          <pre style="white-space: pre-wrap; word-wrap: break-word;">${creditsText}</pre>
        </body>
      </html>
    `;
    licenseWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
  }
};
