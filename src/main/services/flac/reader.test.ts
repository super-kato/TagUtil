import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readMetadata } from './reader';
import { mapToFlacMetadata } from './mappers/flac-read-mapper';
import * as readerImpl from 'music-metadata';
import type { IAudioMetadata } from 'music-metadata';
import type { FlacMetadata } from '@domain/flac/models';

vi.mock('music-metadata', () => ({
  parseFile: vi.fn()
}));

vi.mock('./mappers/flac-read-mapper', () => ({
  mapToFlacMetadata: vi.fn(),
  toRawFlacData: vi.fn((data) => data)
}));

describe('reader', () => {
  const mockPath = '/path/to/music.flac';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('readMetadata', () => {
    it('正常系: メタデータが正常に読み取れること', async () => {
      // 最小限のプロパティを持つオブジェクトを生成
      const mockAudioMetadata = {
        common: {},
        format: {},
        native: {}
      } as IAudioMetadata;

      const mockFlacMetadata: FlacMetadata = {
        title: 'Test'
      };

      vi.mocked(readerImpl.parseFile).mockResolvedValue(mockAudioMetadata);
      vi.mocked(mapToFlacMetadata).mockReturnValue(mockFlacMetadata);

      const result = await readMetadata(mockPath);

      expect(result.type).toBe('success');
      expect(readerImpl.parseFile).toHaveBeenCalledWith(mockPath);
    });

    it('異常系: ファイルが存在しない場合に parseFailed エラーを返すこと', async () => {
      const error = new Error('File not found');
      // Node.jsのエラーを模倣。codeプロパティを動的に追加
      Object.defineProperty(error, 'code', { value: 'ENOENT' });
      vi.mocked(readerImpl.parseFile).mockRejectedValue(error);

      const result = await readMetadata(mockPath);

      expect(result.type).toBe('error');
      if (result.type === 'error') {
        expect(result.error.type).toBe('PARSE_FAILED');
        expect(result.error.options.detail).toContain('File not found');
      }
    });

    it('異常系: その他のエラーの場合に parseFailed エラーを返すこと', async () => {
      const error = new Error('Unknown error');
      vi.mocked(readerImpl.parseFile).mockRejectedValue(error);

      const result = await readMetadata(mockPath);

      expect(result.type).toBe('error');
      if (result.type === 'error') {
        expect(result.error.type).toBe('PARSE_FAILED');
        expect(result.error.options.path).toBe(mockPath);
      }
    });
  });
});
