import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Menu, shell, type MenuItem, type BrowserWindow, type KeyboardEvent } from 'electron';
import { showTrackContextMenu } from './context-menu';

vi.mock('electron', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Menu: {
    buildFromTemplate: vi.fn().mockReturnValue({
      popup: vi.fn()
    })
  },
  shell: {
    showItemInFolder: vi.fn()
  }
}));

describe('context-menu service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('showTrackContextMenu が呼ばれたとき、Menu.buildFromTemplate が正しく呼ばれること', () => {
    const testPath = '/path/to/track.flac';
    showTrackContextMenu(testPath);

    expect(Menu.buildFromTemplate).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          label: 'Show in File Manager'
        })
      ])
    );
  });

  it('メニューアイテムのクリックで shell.showItemInFolder が呼ばれること', () => {
    const testPath = '/path/to/track.flac';
    showTrackContextMenu(testPath);

    // buildFromTemplate に渡されたテンプレートを取得
    const template = vi.mocked(Menu.buildFromTemplate).mock.calls[0][0];
    const item = template.find((i) => i.label === 'Show in File Manager');

    expect(item).toBeDefined();
    if (item && item.click) {
      // 必要な引数をモックして渡す
      item.click({} as MenuItem, {} as BrowserWindow, {} as KeyboardEvent);
      expect(shell.showItemInFolder).toHaveBeenCalledWith(testPath);
    }
  });

  it('menu.popup が呼ばれること', () => {
    const testPath = '/path/to/track.flac';
    showTrackContextMenu(testPath);

    const mockMenu = vi.mocked(Menu.buildFromTemplate).mock.results[0].value;
    expect(mockMenu.popup).toHaveBeenCalled();
  });
});
