import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fileActions } from './file-actions';
import { trackStore } from '@renderer/stores/track-store.svelte';
import { uiState } from '@renderer/stores/ui-state.svelte';
import { selectionState } from '@renderer/stores/selection-state.svelte';
import { tagRepository } from '@renderer/infrastructure/tag-repository';
import { fileRepository } from '@renderer/infrastructure/file-repository';
import { success, failure } from '@domain/common/result';
import { TrackRecord } from '@renderer/stores/track-record.svelte';
import type { FlacMetadata, FlacTrack, TagError } from '@domain/flac/types';

vi.mock('@renderer/infrastructure/tag-repository', () => ({
  tagRepository: { readMetadata: vi.fn() }
}));

vi.mock('@renderer/infrastructure/file-repository', () => ({
  fileRepository: { renameFile: vi.fn() }
}));

vi.mock('@renderer/infrastructure/path-adapter', () => ({
  getDirectoryName: vi.fn(() => '/dir'),
  joinPath: vi.fn((dir, file) => `${dir}/${file}`)
}));

vi.mock('@domain/flac/filename-formatter', () => ({
  formatFlacFilename: vi.fn(() => success('new.flac'))
}));

describe('fileActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    uiState.reset();
    trackStore.tracks = [];
    selectionState.items.clear();
  });

  describe('renameSelectedFiles', () => {
    it('選択されたトラックがない場合は何もしないこと', async () => {
      await fileActions.renameSelectedFiles();
      expect(uiState.isLoading).toBe(false);
    });

    it('トラックのリネームが成功した場合、ストアを更新すること', async () => {
      const metadata: FlacMetadata = { title: 'T' };
      const mockTrack = new TrackRecord('old.flac', metadata);
      trackStore.tracks = [mockTrack];
      selectionState.selectSingle(mockTrack, 0);

      vi.mocked(fileRepository.renameFile).mockResolvedValue(success(undefined));

      const updatedTrack: FlacTrack = {
        path: '/dir/new.flac',
        metadata: { title: 'T', artist: ['Artist'] }
      };
      vi.mocked(tagRepository.readMetadata).mockResolvedValue(success(updatedTrack));

      await fileActions.renameSelectedFiles();

      expect(fileRepository.renameFile).toHaveBeenCalledWith('old.flac', '/dir/new.flac');
      expect(trackStore.tracks[0].path).toBe('/dir/new.flac');
      expect(trackStore.tracks[0].metadata.artist).toStrictEqual(['Artist']);
      expect(selectionState.items.size).toBe(0);
    });

    it('リネームに失敗した場合はエラーを設定し、処理を中断すること', async () => {
      const metadata: FlacMetadata = { title: 'T' };
      const mockTrack = new TrackRecord('old.flac', metadata);
      trackStore.tracks = [mockTrack];
      selectionState.selectSingle(mockTrack, 0);

      const error: TagError = {
        type: 'WRITE_FAILED',
        options: { path: 'old.flac' }
      };
      const mockError = failure(error);
      vi.mocked(fileRepository.renameFile).mockResolvedValue(mockError);

      await fileActions.renameSelectedFiles();

      expect(uiState.error).not.toBeNull();
    });
  });
});
