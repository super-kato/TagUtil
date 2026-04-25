import { describe, it, expect, vi, beforeEach } from 'vitest';
import { tagRepository } from './tag-repository';
import { success, failure } from '@domain/common/result';
import type { FlacTrack, TagError } from '@domain/flac/types';

describe('tag-repository', () => {
  beforeEach(() => {
    vi.stubGlobal('window', {
      api: {
        readMetadata: vi.fn(),
        scanDirectory: vi.fn(),
        selectDirectory: vi.fn(),
        writeMetadata: vi.fn(),
        pickImage: vi.fn(),
        getImageInfo: vi.fn()
      }
    });
  });

  describe('readMetadata', () => {
    it('window.api.readMetadata を呼び出すこと', async () => {
      const track: FlacTrack = { path: 'test.flac', metadata: {} };
      const mockResult = success(track);
      vi.mocked(window.api.readMetadata).mockResolvedValue(mockResult);

      const result = await tagRepository.readMetadata('test.flac');

      expect(result).toStrictEqual(mockResult);
      expect(window.api.readMetadata).toHaveBeenCalledWith('test.flac');
    });
  });

  describe('loadTracksFromPaths', () => {
    it('ディレクトリをスキャンして全てのトラックを読み込むこと', async () => {
      vi.mocked(window.api.scanDirectory).mockResolvedValue(
        success({ paths: ['a.flac', 'b.flac'], isLimited: false })
      );
      const trackA: FlacTrack = { path: 'a.flac', metadata: { title: 'A' } };
      const trackB: FlacTrack = { path: 'b.flac', metadata: { title: 'B' } };
      vi.mocked(window.api.readMetadata)
        .mockResolvedValueOnce(success(trackA))
        .mockResolvedValueOnce(success(trackB));

      const result = await tagRepository.loadTracksFromPaths(['/dir']);

      expect(result.type).toBe('success');
      if (result.type === 'success') {
        expect(result.value.tracks).toHaveLength(2);
        expect(result.value.tracks[0].path).toBe('a.flac');
        expect(result.value.isLimited).toBe(false);
      }
    });

    it('スキャンに失敗した場合はエラーを返すこと', async () => {
      const error: TagError = {
        type: 'SCAN_FAILED',
        options: { path: '/dir' }
      };
      const mockError = failure(error);
      vi.mocked(window.api.scanDirectory).mockResolvedValue(mockError);

      const result = await tagRepository.loadTracksFromPaths(['/dir']);

      expect(result).toStrictEqual(mockError);
    });
  });

  describe('saveTracks', () => {
    it('全てのトラックに対して保存を試行すること', async () => {
      vi.mocked(window.api.writeMetadata).mockResolvedValue(success(undefined));
      const tracks: FlacTrack[] = [
        { path: 'a.flac', metadata: {} },
        { path: 'b.flac', metadata: {} }
      ];

      const result = await tagRepository.saveTracks(tracks);

      expect(result.type).toBe('success');
      expect(window.api.writeMetadata).toHaveBeenCalledTimes(2);
    });

    it('途中で失敗した場合はエラーを返し、それ以降の保存を中断すること', async () => {
      const error: TagError = {
        type: 'WRITE_FAILED',
        options: { path: 'b.flac' }
      };
      vi.mocked(window.api.writeMetadata)
        .mockResolvedValueOnce(success(undefined))
        .mockResolvedValueOnce(failure(error));
      const tracks: FlacTrack[] = [
        { path: 'a.flac', metadata: {} },
        { path: 'b.flac', metadata: {} },
        { path: 'c.flac', metadata: {} }
      ];

      const result = await tagRepository.saveTracks(tracks);

      expect(result.type).toBe('error');
      expect(window.api.writeMetadata).toHaveBeenCalledTimes(2);
    });
  });
});
