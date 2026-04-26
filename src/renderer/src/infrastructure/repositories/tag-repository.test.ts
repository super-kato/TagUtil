import { describe, it, expect, vi, beforeEach } from 'vitest';
import { tagRepository } from './tag-repository';
import { success, failure } from '@domain/common/result';
import type { FlacTrack } from '@domain/flac/models';
import type { AppError } from '@domain/flac/errors';

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
      const error: AppError = {
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
      vi.mocked(window.api.writeMetadata).mockImplementation(async (track) => success(track.path));
      const tracks: FlacTrack[] = [
        { path: 'a.flac', metadata: {} },
        { path: 'b.flac', metadata: {} }
      ];

      const result = await tagRepository.saveTracks(tracks);

      expect(result.successes).toHaveLength(2);
      expect(result.errors).toHaveLength(0);
      expect(window.api.writeMetadata).toHaveBeenCalledTimes(2);
    });

    it('一部が失敗しても全ての保存を試行し、エラーを集約すること', async () => {
      const error: AppError = {
        type: 'WRITE_FAILED',
        options: { path: 'b.flac' }
      };
      vi.mocked(window.api.writeMetadata)
        .mockResolvedValueOnce(success('a.flac'))
        .mockResolvedValueOnce(failure(error))
        .mockResolvedValueOnce(success('c.flac'));

      const tracks: FlacTrack[] = [
        { path: 'a.flac', metadata: {} },
        { path: 'b.flac', metadata: {} },
        { path: 'c.flac', metadata: {} }
      ];

      const result = await tagRepository.saveTracks(tracks);

      expect(result.successes).toEqual(['a.flac', 'c.flac']);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].path).toBe('b.flac');
      // 一つが失敗しても全てのトラックに対して書き込みを試行する
      expect(window.api.writeMetadata).toHaveBeenCalledTimes(3);
    });
  });

  describe('scanAndLoadTracks', () => {
    it('ディレクトリを選択してスキャンを実行すること', async () => {
      vi.mocked(window.api.selectDirectory).mockResolvedValue('/mock/dir');
      vi.mocked(window.api.scanDirectory).mockResolvedValue(
        success({ paths: ['a.flac'], isLimited: false })
      );
      vi.mocked(window.api.readMetadata).mockResolvedValue(
        success({ path: 'a.flac', metadata: {} })
      );

      const result = await tagRepository.scanAndLoadTracks();

      expect(result.type).toBe('success');
      expect(window.api.selectDirectory).toHaveBeenCalled();
    });

    it('ディレクトリ選択がキャンセルされた場合は null を返すこと', async () => {
      vi.mocked(window.api.selectDirectory).mockResolvedValue(null);

      const result = await tagRepository.scanAndLoadTracks();

      expect(result.type).toBe('success');
      if (result.type === 'success') {
        expect(result.value).toBeNull();
      }
    });
  });

  describe('pickImage', () => {
    it('window.api.pickImage を呼び出すこと', async () => {
      const mockResult = success({ format: 'image/png', sourcePath: 'p', hash: 'h' });
      vi.mocked(window.api.pickImage).mockResolvedValue(mockResult);

      const result = await tagRepository.pickImage();

      expect(result).toStrictEqual(mockResult);
      expect(window.api.pickImage).toHaveBeenCalled();
    });
  });

  describe('getImageInfo', () => {
    it('window.api.getImageInfo を呼び出すこと', async () => {
      const mockResult = success({ format: 'image/jpeg', sourcePath: 'p', hash: 'h' });
      vi.mocked(window.api.getImageInfo).mockResolvedValue(mockResult);

      const result = await tagRepository.getImageInfo('test.jpg');

      expect(result).toStrictEqual(mockResult);
      expect(window.api.getImageInfo).toHaveBeenCalledWith('test.jpg');
    });
  });
});
