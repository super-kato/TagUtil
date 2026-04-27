import { Menu, MenuItemConstructorOptions, shell } from 'electron';

/**
 * トラック行のコンテキストメニューを表示します。
 * @param path 対象ファイルの絶対パス
 */
export const showTrackContextMenu = (path: string): void => {
  const template: MenuItemConstructorOptions[] = [
    {
      label: 'Show in File Manager',
      click: (): void => {
        shell.showItemInFolder(path);
      }
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  menu.popup();
};
