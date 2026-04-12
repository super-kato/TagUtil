import openAboutWindow from 'about-window';
import { app } from 'electron';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import pkg from '../../../../package.json';
import icon from '../../../../resources/icon.png?asset';

/**
 * 「このアプリについて」ウィンドウを表示します。
 */
export const showAboutWindow = (): void => {
  const licensesPath = join(app.getAppPath(), 'resources/licenses.json');
  let credits: string[] = [];

  if (existsSync(licensesPath)) {
    try {
      credits = JSON.parse(readFileSync(licensesPath, 'utf8'));
    } catch (e) {
      console.error('Failed to load licenses:', e);
    }
  }

  openAboutWindow({
    /* eslint-disable @typescript-eslint/naming-convention */
    icon_path: icon,
    product_name: 'TagUtil',
    copyright: 'Copyright (c) 2026 katouyoshiaki',
    homepage: 'https://github.com/super-kato/TagUtil',
    bug_report_url: 'https://github.com/super-kato/TagUtil/issues',
    use_version_info: [
      ['Version', pkg.version],
      ['Electron', process.versions.electron],
      ['Node', process.versions.node],
      ['Chrome', process.versions.chrome]
    ],
    // @ts-ignore: additional_credits exists in about-window
    additional_credits: credits
    /* eslint-enable @typescript-eslint/naming-convention */
  });
};
