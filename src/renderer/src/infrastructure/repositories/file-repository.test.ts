import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fileRepository } from './file-repository';
import { success } from '@domain/common/result';

describe('file-repository', () => {
  beforeEach(() => {
    vi.stubGlobal('window', {
      api: {
        renameFile: vi.fn()
      }
    });
  });

  describe('renameFile', () => {
    it('window.api.renameFile を呼び出すこと', async () => {
      vi.mocked(window.api.renameFile).mockResolvedValue(success(undefined));

      const result = await fileRepository.renameFile('old.flac', 'new.flac');

      expect(result.type).toBe('success');
      expect(window.api.renameFile).toHaveBeenCalledWith('old.flac', 'new.flac');
    });
  });
});
