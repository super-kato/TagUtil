import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fileActions } from './file-actions';
import { trackStore } from '@renderer/stores/track-store.svelte';
import { uiState } from '@renderer/stores/ui-state.svelte';
import { selectionState } from '@renderer/stores/selection-state.svelte';
import { tagRepository } from '@renderer/infrastructure/repositories/tag-repository';
import { fileRepository } from '@renderer/infrastructure/repositories/file-repository';
import { success, failure } from '@domain/common/result';
import { TrackRecord } from '@renderer/stores/track-record.svelte';
import { tagErrors } from '@domain/flac/errors';
import type { FlacMetadata, FlacTrack } from '@domain/flac/models';
import * as pathAdapter from '@renderer/infrastructure/adapters/path-adapter';

describe('fileActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    uiState.stopLoading();
    trackStore.tracks = [];
    selectionState.items.clear();
    vi.spyOn(tagRepository, 'readMetadata');
    vi.spyOn(fileRepository, 'renameFile');
    vi.spyOn(pathAdapter, 'generateNewPath').mockResolvedValue(success('/dir/new.flac'));
    vi.stubGlobal('window', {
      api: {
        generateNewPath: vi.fn().mockResolvedValue(success('/dir/new.flac'))
      }
    });
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

    it('パス生成に失敗した場合は処理を中断すること', async () => {
      const metadata: FlacMetadata = { title: 'T' };
      const mockTrack = new TrackRecord('old.flac', metadata);
      trackStore.tracks = [mockTrack];
      selectionState.selectSingle(mockTrack, 0);

      vi.mocked(pathAdapter.generateNewPath).mockResolvedValue(
        failure(tagErrors.parseFailed({ path: 'old.flac' }))
      );

      await fileActions.renameSelectedFiles();

      expect(fileRepository.renameFile).not.toHaveBeenCalled();
    });

    it('物理的なリネームに失敗した場合は処理を中断すること', async () => {
      const metadata: FlacMetadata = { title: 'T' };
      const mockTrack = new TrackRecord('old.flac', metadata);
      trackStore.tracks = [mockTrack];
      selectionState.selectSingle(mockTrack, 0);

      vi.mocked(fileRepository.renameFile).mockResolvedValue(
        failure({ type: 'WRITE_FAILED', options: { path: 'old.flac' } })
      );

      await fileActions.renameSelectedFiles();

      // ストアが更新されていないことを確認
      expect(trackStore.tracks[0].path).toBe('old.flac');
    });
  });
});
