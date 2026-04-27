import { describe, it, expect, vi, beforeEach } from 'vitest';
import { contextMenuAdapter } from './context-menu-adapter';

describe('contextMenuAdapter', () => {
  beforeEach(() => {
    vi.stubGlobal('window', {
      api: {
        showTrackContextMenu: vi.fn()
      }
    });
  });

  it('showTrackContextMenu が呼ばれたとき、正しいパスで window.api.showTrackContextMenu を呼び出すこと', async () => {
    const testPath = '/path/to/track.flac';
    await contextMenuAdapter.showTrackContextMenu(testPath);

    expect(window.api.showTrackContextMenu).toHaveBeenCalledWith(testPath);
  });
});
