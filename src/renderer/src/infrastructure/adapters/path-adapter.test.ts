import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getDirectoryName, joinPath } from './path-adapter';

describe('path-adapter', () => {
  beforeEach(() => {
    vi.stubGlobal('window', {
      api: {
        path: {
          dirname: vi.fn(),
          join: vi.fn()
        }
      }
    });
  });

  describe('getDirectoryName', () => {
    it('window.api.path.dirname を呼び出すこと', async () => {
      const path = '/path/to/file.txt';
      vi.mocked(window.api.path.dirname).mockResolvedValue('/path/to');

      const result = await getDirectoryName(path);

      expect(result).toBe('/path/to');
      expect(window.api.path.dirname).toHaveBeenCalledWith(path);
    });
  });

  describe('joinPath', () => {
    it('window.api.path.join を呼び出すこと', async () => {
      const dir = '/path/to';
      const filename = 'file.txt';
      vi.mocked(window.api.path.join).mockResolvedValue('/path/to/file.txt');

      const result = await joinPath(dir, filename);

      expect(result).toBe('/path/to/file.txt');
      expect(window.api.path.join).toHaveBeenCalledWith(dir, filename);
    });
  });
});
