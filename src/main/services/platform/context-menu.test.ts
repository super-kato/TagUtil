import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Menu, shell } from 'electron';
import { showTrackContextMenu } from './context-menu';

vi.mock('electron', () => ({
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
      // モックの引数を適当に渡してクリックをシミュレート
      item.click({} as any, {} as any, {} as any);
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
