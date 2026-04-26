import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initializePlatform, IS_MAC } from './platform-adapter';

describe('platform-adapter', () => {
  beforeEach(() => {
    vi.stubGlobal('window', {
      api: {
        getPlatform: vi.fn()
      }
    });
  });

  it('Windows 環境の場合、initializePlatform 呼び出し後に IS_MAC が false になること', async () => {
    vi.mocked(window.api.getPlatform).mockResolvedValue({ isMac: false });

    await initializePlatform();

    expect(IS_MAC).toBe(false);
  });

  it('Mac 環境の場合、initializePlatform 呼び出し後に IS_MAC が true になること', async () => {
    vi.mocked(window.api.getPlatform).mockResolvedValue({ isMac: true });

    await initializePlatform();

    expect(IS_MAC).toBe(true);
  });
});
