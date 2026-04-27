import {
  getAppResourcePath,
  readJsonFile
} from '@main/infrastructure/repositories/file-repository';
import iconPath from '@resources/icon.png?asset';
import pkg from '@root/package.json';
import { BrowserWindow, dialog, nativeImage } from 'electron';

/**
 * 「このアプリについて」ダイアログを表示します。
 */
export const showAboutWindow = async (): Promise<void> => {
  const icon = nativeImage.createFromPath(iconPath);

  const { response } = await dialog.showMessageBox({
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

  if (response !== 1) {
    return;
  }

  // Acknowledgements ボタンが押された場合
  const licensesPath = getAppResourcePath('resources/licenses.json');
  const credits = await readJsonFile<string[]>(licensesPath);
  const creditsText = credits.join('\n');

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

  const html = `
      <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              font-size: 13px;
              line-height: 1.6;
              padding: 24px;
              background-color: #1e1e1e;
              color: #e0e0e0;
              margin: 0;
            }
            pre {
              white-space: pre-wrap;
              word-wrap: break-word;
              margin: 0;
              opacity: 0.9;
            }
          </style>
        </head>
        <body>
          <pre>${creditsText}</pre>
        </body>
      </html>
    `;
  licenseWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
};
