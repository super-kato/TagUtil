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

vi.mock('@renderer/stores/track-store.svelte', () => ({
  trackStore: {
    tracks: [],
    get selectedTracks() {
      return [];
    }
  }
}));

vi.mock('@renderer/stores/ui-state.svelte', () => ({
  uiState: {
    startLoading: vi.fn(),
    stopLoading: vi.fn(),
    clearError: vi.fn(),
    setError: vi.fn(),
    error: null
  }
}));

vi.mock('@renderer/stores/selection-state.svelte', () => ({
  selectionState: {
    paths: { clear: vi.fn() }
  }
}));

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
    vi.spyOn(uiState, 'error', 'get').mockReturnValue(null);
  });

  describe('renameSelectedFiles', () => {
    it('選択されたトラックがない場合は何もしないこと', async () => {
      vi.spyOn(trackStore, 'selectedTracks', 'get').mockReturnValue([]);

      await fileActions.renameSelectedFiles();

      expect(uiState.startLoading).not.toHaveBeenCalled();
    });

    it('トラックのリネームが成功した場合、ストアを更新すること', async () => {
      const mockTrack = new TrackRecord('old.flac', { title: 'T' } as FlacMetadata);

      vi.spyOn(trackStore, 'selectedTracks', 'get').mockReturnValue([mockTrack]);
      trackStore.tracks = [mockTrack];

      vi.mocked(fileRepository.renameFile).mockResolvedValue(success(undefined));
      vi.mocked(tagRepository.readMetadata).mockResolvedValue(
        success({ path: '/dir/new.flac', metadata: { title: 'T', artist: ['Artist'] } } as FlacTrack)
      );

      await fileActions.renameSelectedFiles();

      expect(fileRepository.renameFile).toHaveBeenCalledWith('old.flac', '/dir/new.flac');
      expect(trackStore.tracks[0].path).toBe('/dir/new.flac');
      expect(trackStore.tracks[0].metadata.artist).toEqual(['Artist']);
      expect(selectionState.paths.clear).toHaveBeenCalled();
    });

    it('リネームに失敗した場合はエラーを設定し、処理を中断すること', async () => {
      const mockTrack = new TrackRecord('old.flac', { title: 'T' } as FlacMetadata);
      vi.spyOn(trackStore, 'selectedTracks', 'get').mockReturnValue([mockTrack]);

      const mockError = failure({
        type: 'WRITE_FAILED',
        options: { path: 'old.flac' }
      } as TagError);
      vi.mocked(fileRepository.renameFile).mockResolvedValue(mockError);

      // uiState.error をシミュレート
      vi.mocked(uiState.setError).mockImplementation(() => {
        vi.spyOn(uiState, 'error', 'get').mockReturnValue('Error occurred');
      });

      await fileActions.renameSelectedFiles();

      expect(uiState.setError).toHaveBeenCalledWith(mockError);
    });
  });
});
