import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateNewPath } from './path-adapter';
import { success } from '@domain/common/result';
import type { FlacTrack } from '@domain/flac/models';

describe('path-adapter', () => {
  beforeEach(() => {
    vi.stubGlobal('window', {
      api: {
        generateNewPath: vi.fn()
      }
    });
  });

  describe('generateNewPath', () => {
    it('window.api.generateNewPath を呼び出すこと', async () => {
      const track = {
        path: '/dir/old.flac',
        metadata: { title: 'T', trackNumber: '1' }
      };
      const expected = success('/dir/01 - T.flac');
      vi.stubGlobal('window', {
        api: {
          generateNewPath: vi.fn().mockResolvedValue(expected)
        }
      });

      const result = await generateNewPath(track as FlacTrack);

      expect(result).toBe(expected);
      expect(window.api.generateNewPath).toHaveBeenCalledWith(track);
    });
  });
});
