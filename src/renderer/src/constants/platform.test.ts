import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initializePlatform, IS_MAC } from './platform';
import * as adapter from '@renderer/infrastructure/platform-adapter';

vi.mock('@renderer/infrastructure/platform-adapter');

describe('platform constant (renderer)', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('initializePlatform 呼び出し後に IS_MAC が正しく更新されること', async () => {
    // Mac の場合
    vi.mocked(adapter.getPlatform).mockResolvedValue({
      isMac: true
    });
    await initializePlatform();
    expect(IS_MAC).toBe(true);

    // Windows の場合
    vi.mocked(adapter.getPlatform).mockResolvedValue({
      isMac: false
    });
    await initializePlatform();
    expect(IS_MAC).toBe(false);
  });
});
