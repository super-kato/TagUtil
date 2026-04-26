import { describe, it, expect, vi, beforeEach } from 'vitest';
import { writeMetadata } from './writer';
import { readRawData } from './reader';
import { resolvePictureForWrite } from './mappers/flac-write-picture-resolver';
import { mergeMetadataWithTags } from './mappers/flac-write-mapper';
import { withAtomicWrite } from '@main/utils/file-utils';
import type { FlacTrack } from '@domain/flac/models';
import type { RawFlacData } from './types';
import type { FlacTags } from 'flac-tagger';

vi.mock('./reader', () => ({
  readRawData: vi.fn()
}));

vi.mock('./mappers/flac-write-picture-resolver', () => ({
  resolvePictureForWrite: vi.fn()
}));

vi.mock('./mappers/flac-write-mapper', () => ({
  mergeMetadataWithTags: vi.fn()
}));

vi.mock('@main/utils/file-utils', () => ({
  withAtomicWrite: vi.fn()
}));

vi.mock('flac-tagger', () => ({
  writeFlacTags: vi.fn()
}));

describe('writer', () => {
  const mockTrack: FlacTrack = {
    path: '/path/to/music.flac',
    metadata: {
      title: 'Test Title',
      artist: ['Test Artist']
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('writeMetadata', () => {
    it('正常系: メタデータが正常に書き込まれること', async () => {
      const mockRawData: RawFlacData = {
        path: mockTrack.path,
        tags: {},
        pictures: [],
        streamInfo: {}
      };
      const mockTags: FlacTags = {
        tagMap: { TITLE: 'Test Title' }
      };

      vi.mocked(readRawData).mockResolvedValue(mockRawData);
      vi.mocked(resolvePictureForWrite).mockResolvedValue(undefined);
      vi.mocked(mergeMetadataWithTags).mockReturnValue(mockTags);
      vi.mocked(withAtomicWrite).mockImplementation(async (_, task) => {
        await task('/path/to/temp.flac');
      });

      const result = await writeMetadata(mockTrack);

      expect(result.type).toBe('success');
      expect(withAtomicWrite).toHaveBeenCalled();
    });

    it('異常系: ファイルが存在しない場合に writeFailed エラーを返すこと', async () => {
      const error = new Error('File not found');
      Object.defineProperty(error, 'code', { value: 'ENOENT' });
      vi.mocked(readRawData).mockRejectedValue(error);

      const result = await writeMetadata(mockTrack);

      expect(result.type).toBe('error');
      if (result.type === 'error') {
        expect(result.error.type).toBe('WRITE_FAILED');
        expect(result.error.options.detail).toContain('File not found');
      }
    });

    it('異常系: 権限不足の場合に writeFailed エラーを返すこと', async () => {
      const error = new Error('Permission denied');
      Object.defineProperty(error, 'code', { value: 'EACCES' });
      vi.mocked(readRawData).mockRejectedValue(error);

      const result = await writeMetadata(mockTrack);

      expect(result.type).toBe('error');
      if (result.type === 'error') {
        expect(result.error.type).toBe('WRITE_FAILED');
        expect(result.error.options.detail).toContain('Permission denied');
      }
    });

    it('異常系: その他のエラーの場合に writeFailed エラーを返すこと', async () => {
      const error = new Error('Unknown error');
      vi.mocked(readRawData).mockRejectedValue(error);

      const result = await writeMetadata(mockTrack);

      expect(result.type).toBe('error');
      if (result.type === 'error') {
        expect(result.error.type).toBe('WRITE_FAILED');
        expect(result.error.options.path).toBe(mockTrack.path);
      }
    });
  });
});
