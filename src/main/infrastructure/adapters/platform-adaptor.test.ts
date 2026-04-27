import { afterEach, describe, expect, it, vi } from 'vitest';
import { getPlatform } from './platform-adaptor';

describe('platform service (main)', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('darwin (macOS) 環境で isMac が true になること', () => {
    vi.stubGlobal('process', { ...process, platform: 'darwin' });
    const platform = getPlatform();
    expect(platform.isMac).toBe(true);
  });

  it('win32 (Windows) 環境で isMac が false になること', () => {
    vi.stubGlobal('process', { ...process, platform: 'win32' });
    const platform = getPlatform();
    expect(platform.isMac).toBe(false);
  });

  it('linux 環境で isMac が false になること', () => {
    vi.stubGlobal('process', { ...process, platform: 'linux' });
    const platform = getPlatform();
    expect(platform.isMac).toBe(false);
  });
});
