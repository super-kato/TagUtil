import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readJsonFile, readFileWithHash } from './file-read-repository';
import * as fs from 'node:fs/promises';
import { computeMd5 } from '@main/utils/crypto';

vi.mock('node:fs/promises');
vi.mock('@main/utils/crypto');

describe('file-read-repository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('readJsonFile', () => {
    it('JSONファイルを読み込み、オブジェクトとしてパースすること', async () => {
      const mockContent = JSON.stringify({ key: 'value' });
      vi.mocked(fs.readFile).mockResolvedValue(mockContent);

      const result = await readJsonFile<{ key: string }>('test.json');

      expect(fs.readFile).toHaveBeenCalledWith('test.json', 'utf8');
      expect(result).toEqual({ key: 'value' });
    });
  });

  describe('readFileWithHash', () => {
    it('ファイルを読み込み、バッファとハッシュ値を返すこと', async () => {
      const mockBuffer = Buffer.from('test data');
      const mockHash = 'mock-hash';
      vi.mocked(fs.readFile).mockResolvedValue(mockBuffer);
      vi.mocked(computeMd5).mockReturnValue(mockHash);

      const result = await readFileWithHash('test.flac');

      expect(fs.readFile).toHaveBeenCalledWith('test.flac');
      expect(computeMd5).toHaveBeenCalledWith(mockBuffer);
      expect(result).toEqual({
        buffer: mockBuffer,
        hash: mockHash
      });
    });
  });
});
