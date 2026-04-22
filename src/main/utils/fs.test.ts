import { describe, it, expect, vi } from 'vitest';
import { ensureFileExists } from './fs';
import fs from 'fs/promises';

vi.mock('fs/promises');

describe('fs utils', () => {
  describe('ensureFileExists', () => {
    it('ファイルが存在する場合、例外をスローしないこと', async () => {
      vi.mocked(fs.access).mockResolvedValue(undefined);

      await expect(ensureFileExists('/path/to/file')).resolves.not.toThrow();
      expect(fs.access).toHaveBeenCalledWith('/path/to/file');
    });

    it('ファイルが存在しない場合、例外をスローすること', async () => {
      vi.mocked(fs.access).mockRejectedValue(new Error('ENOENT'));

      await expect(ensureFileExists('/path/to/missing')).rejects.toThrow(
        'File not found: /path/to/missing'
      );
    });
  });
});
