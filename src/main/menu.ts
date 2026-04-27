import { Menu, MenuItemConstructorOptions, app, shell } from 'electron';
import { showAboutWindow } from './infrastructure/platform/about';
import { checkForUpdates } from './infrastructure/platform/update';

const isMac = process.platform === 'darwin';

/**
 * アプリケーションのカスタムメニューを構築・設定します。
 */
export const setAppMenu = (): void => {
  const template: MenuItemConstructorOptions[] = [
    // macOS: Application Menu
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { label: `About ${app.name}`, click: showAboutWindow },
              { type: 'separator' },
              { label: 'Check for Updates...', click: checkForUpdates },
              { type: 'separator' },
              { role: 'services' },
              { type: 'separator' },
              { role: 'hide', label: `Hide ${app.name}` },
              { role: 'hideOthers', label: 'Hide Others' },
              { role: 'unhide', label: 'Show All' },
              { type: 'separator' },
              { role: 'quit', label: `Quit ${app.name}` }
            ] as MenuItemConstructorOptions[]
          }
        ]
      : []),
    // Standard Menus
    { role: 'fileMenu' },
    { role: 'editMenu' },
    { role: 'viewMenu' },
    { role: 'windowMenu' },
    // Help Menu
    {
      label: 'Help',
      role: 'help',
      submenu: [
        {
          label: 'Learn More (GitHub)',
          click: async (): Promise<void> => {
            await shell.openExternal('https://github.com/super-kato/TagUtil');
          }
        },
        ...(isMac
          ? []
          : [
              { type: 'separator' },
              { label: 'Check for Updates...', click: checkForUpdates },
              { label: 'About TagUtil', click: showAboutWindow }
            ])
      ] as MenuItemConstructorOptions[]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};
