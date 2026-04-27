import type { FlacTrack } from '@domain/flac/models';
import { readRawFlacData } from '@main/infrastructure/repositories/flac-read-repository';
import { writeFlacTagsWithAtomic } from '@main/infrastructure/repositories/flac-write-repository';
import { RawFlacData, RawFlacTags } from '@main/infrastructure/repositories/repository-types';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mergeMetadataWithTags } from './mappers/flac-write-mapper';
import { resolvePictureForWrite } from './mappers/flac-write-picture-resolver';
import { writeMetadata } from './writer';

vi.mock('@main/infrastructure/repositories/flac-read-repository', () => ({
  readRawFlacData: vi.fn()
}));

vi.mock('@main/infrastructure/repositories/flac-write-repository', () => ({
  writeFlacTagsWithAtomic: vi.fn()
}));

vi.mock('./mappers/flac-write-picture-resolver', () => ({
  resolvePictureForWrite: vi.fn()
}));

vi.mock('./mappers/flac-write-mapper', () => ({
  mergeMetadataWithTags: vi.fn()
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
        streamInfo: {
          sampleRate: 44100,
          bitDepth: 16,
          channels: 2,
          duration: 100
        }
      };
      const mockTags: RawFlacTags = {
        tags: { TITLE: ['Test Title'] },
        pictures: []
      };

      vi.mocked(readRawFlacData).mockResolvedValue(mockRawData);
      vi.mocked(resolvePictureForWrite).mockResolvedValue(undefined);
      vi.mocked(mergeMetadataWithTags).mockReturnValue(mockTags);

      const result = await writeMetadata(mockTrack);

      expect(result.type).toBe('success');
      if (result.type === 'success') {
        expect(result.value).toBe(mockTrack.path);
      }
      expect(writeFlacTagsWithAtomic).toHaveBeenCalled();
    });

    it('異常系: ファイルが存在しない場合に writeFailed エラーを返すこと', async () => {
      const error = new Error('File not found');
      Object.defineProperty(error, 'code', { value: 'ENOENT' });
      vi.mocked(readRawFlacData).mockRejectedValue(error);

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
      vi.mocked(readRawFlacData).mockRejectedValue(error);

      const result = await writeMetadata(mockTrack);

      expect(result.type).toBe('error');
      if (result.type === 'error') {
        expect(result.error.type).toBe('WRITE_FAILED');
        expect(result.error.options.detail).toContain('Permission denied');
      }
    });

    it('異常系: その他のエラーの場合に writeFailed エラーを返すこと', async () => {
      const error = new Error('Unknown error');
      vi.mocked(readRawFlacData).mockRejectedValue(error);

      const result = await writeMetadata(mockTrack);

      expect(result.type).toBe('error');
      if (result.type === 'error') {
        expect(result.error.type).toBe('WRITE_FAILED');
        expect(result.error.options.path).toBe(mockTrack.path);
      }
    });
  });
});
