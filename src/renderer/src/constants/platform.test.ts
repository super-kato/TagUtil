import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initializePlatform, IS_MAC } from './platform';
import * as adapter from '@renderer/infrastructure/platform-adapter';

vi.mock('@renderer/infrastructure/platform-adapter');

describe('platform constant (renderer)', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('Mac 環境の場合、initializePlatform 呼び出し後に IS_MAC が true になること', async () => {
    vi.mocked(adapter.getPlatform).mockResolvedValue({
      isMac: true
    });

    await initializePlatform();

    expect(IS_MAC).toBe(true);
  });

  it('Windows 環境の場合、initializePlatform 呼び出し後に IS_MAC が false になること', async () => {
    vi.mocked(adapter.getPlatform).mockResolvedValue({
      isMac: false
    });

    await initializePlatform();

    expect(IS_MAC).toBe(false);
  });
});
