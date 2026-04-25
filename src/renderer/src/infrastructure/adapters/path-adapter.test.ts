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
    it('window.api.path.dirname を呼び出すこと', () => {
      const path = '/path/to/file.txt';
      vi.mocked(window.api.path.dirname).mockReturnValue('/path/to');

      const result = getDirectoryName(path);

      expect(result).toBe('/path/to');
      expect(window.api.path.dirname).toHaveBeenCalledWith(path);
    });
  });

  describe('joinPath', () => {
    it('window.api.path.join を呼び出すこと', () => {
      const dir = '/path/to';
      const filename = 'file.txt';
      vi.mocked(window.api.path.join).mockReturnValue('/path/to/file.txt');

      const result = joinPath(dir, filename);

      expect(result).toBe('/path/to/file.txt');
      expect(window.api.path.join).toHaveBeenCalledWith(dir, filename);
    });
  });
});
