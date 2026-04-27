import { success } from '@domain/common/result';
import type { FlacTrack } from '@domain/flac/models';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { generateNewPath } from './path-adapter';

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
      const track: FlacTrack = {
        path: '/dir/old.flac',
        metadata: { title: 'T', trackNumber: '1' }
      };
      const expected = success('/dir/01 - T.flac');
      vi.stubGlobal('window', {
        api: {
          generateNewPath: vi.fn().mockResolvedValue(expected)
        }
      });

      const result = await generateNewPath(track);

      expect(result).toBe(expected);
      expect(window.api.generateNewPath).toHaveBeenCalledWith(track);
    });
  });
});
