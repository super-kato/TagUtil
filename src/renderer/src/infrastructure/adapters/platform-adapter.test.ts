import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPlatform } from './platform-adapter';

describe('platform-adapter', () => {
  beforeEach(() => {
    vi.stubGlobal('window', {
      api: {
        getPlatform: vi.fn()
      }
    });
  });

  it('メインプロセスの getPlatform を呼び出し、結果を返すこと', async () => {
    const mockPlatform = { isMac: true };
    vi.mocked(window.api.getPlatform).mockResolvedValue(mockPlatform);

    const result = await getPlatform();

    expect(window.api.getPlatform).toHaveBeenCalled();
    expect(result).toEqual(mockPlatform);
  });
});
