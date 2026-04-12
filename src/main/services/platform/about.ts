import { app, dialog, nativeImage } from 'electron';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import pkg from '../../../../package.json';
import iconPath from '../../../../resources/icon.png?asset';

/**
 * 「このアプリについて」ダイアログを表示します。
 */
export const showAboutWindow = (): void => {
  const icon = nativeImage.createFromPath(iconPath);
  const licensesPath = join(app.getAppPath(), 'resources/licenses.json');
  let creditsText = '';

  if (existsSync(licensesPath)) {
    try {
      const credits = JSON.parse(readFileSync(licensesPath, 'utf8')) as string[];
      creditsText = '\n\nAcknowledgements:\n' + credits.join('\n');
    } catch (e) {
      console.error('Failed to load licenses:', e);
    }
  }

  dialog.showMessageBox({
    type: 'info',
    title: 'About TagUtil',
    message: 'TagUtil',
    detail:
      `Version: ${pkg.version}\n` +
      `Electron: ${process.versions.electron}\n` +
      `Chrome: ${process.versions.chrome}\n` +
      `Node.js: ${process.versions.node}\n\n` +
      `Copyright (c) 2026 katouyoshiaki\n` +
      `https://github.com/super-kato/TagUtil` +
      creditsText,
    buttons: ['OK'],
    icon: icon
  });
};
