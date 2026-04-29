import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renameFile, resolveRenamedPath } from './renamer';
import * as fileRenameRepo from '@main/infrastructure/repositories/file/file-rename-repository';
import * as filePathRepo from '@main/infrastructure/repositories/file/file-path-repository';
import { settingsRepository } from '@main/infrastructure/repositories/settings/settings-repository';
import { FlacTrack } from '@domain/flac/models';

vi.mock('@main/infrastructure/repositories/file/file-rename-repository');
vi.mock('@main/infrastructure/repositories/file/file-path-repository');
vi.mock('@main/infrastructure/logging/logger');

describe('renamer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    settingsRepository.updateSettings({
      renamePattern: '{trackNumber} - {title}',
      trackNumberPadding: 2
    });
  });

  describe('renameFile', () => {
    it('正常にリネームできた場合、成功を返すこと', async () => {
      vi.mocked(fileRenameRepo.renameFileExclusive).mockResolvedValue(undefined);

      const result = await renameFile('/old/path.flac', '/new/path.flac');

      expect(result.type).toBe('success');
      expect(fileRenameRepo.renameFileExclusive).toHaveBeenCalledWith(
        '/old/path.flac',
        '/new/path.flac'
      );
    });

    it('リネームに失敗した場合、エラーを返すこと', async () => {
      vi.mocked(fileRenameRepo.renameFileExclusive).mockRejectedValue(new Error('Rename error'));

      const result = await renameFile('/old/path.flac', '/new/path.flac');

      expect(result.type).toBe('error');
      if (result.type === 'error') {
        expect(result.error.type).toBe('WRITE_FAILED');
      }
    });
  });

  describe('resolveRenamedPath', () => {
    it('トラック情報から新しいパスを算出できること', () => {
      const track: FlacTrack = {
        path: '/dir/old.flac',
        metadata: {
          title: 'Song',
          trackNumber: '1'
        }
      };

      vi.mocked(filePathRepo.resolveNewPath).mockReturnValue('/dir/01 - Song.flac');

      const result = resolveRenamedPath(track);

      expect(result.type).toBe('success');
      if (result.type === 'success') {
        expect(result.value).toBe('/dir/01 - Song.flac');
      }
    });

    it('タグ情報が不足している場合にエラーを返すこと', () => {
      const track: FlacTrack = {
        path: '/dir/old.flac',
        metadata: {
          title: '', // タイトル空
          trackNumber: '1'
        }
      };

      const result = resolveRenamedPath(track);

      expect(result.type).toBe('error');
      if (result.type === 'error') {
        expect(result.error.type).toBe('MISSING_REQUIRED_TAG');
      }
    });

    it('リネームパターンにプレースホルダが含まれていない場合にエラーを返すこと', () => {
      settingsRepository.updateSettings({
        renamePattern: 'fixed-name', // プレースホルダなし
        trackNumberPadding: 2
      });
      const track: FlacTrack = {
        path: '/dir/old.flac',
        metadata: { title: 'Song' }
      };

      const result = resolveRenamedPath(track);

      expect(result.type).toBe('error');
      if (result.type === 'error') {
        expect(result.error.type).toBe('INVALID_RENAME_PATTERN');
      }
    });
  });
});
