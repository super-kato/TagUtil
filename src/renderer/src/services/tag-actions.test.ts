import { beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { TrackRecord } from '@renderer/stores/track-record.svelte';
import { trackStore } from '@renderer/stores/track-store.svelte';
import { uiState } from '@renderer/stores/ui-state.svelte';
import { tagRepository } from '@renderer/infrastructure/repositories/tag-repository';
import { tagActions } from './tag-actions';
import { tagEditor } from './tag-editor';
import type { FlacMetadata } from '@domain/flac/types';

describe('tagActions', () => {
  const metadata: FlacMetadata = { title: 'T' };
  const mockTracks = [new TrackRecord('file1.flac', metadata)];

  beforeEach(() => {
    vi.clearAllMocks();
    // 全てのテストで共通の selectedTracks を提供
    vi.spyOn(trackStore, 'selectedTracks', 'get').mockReturnValue(mockTracks);
    vi.spyOn(trackStore, 'tracks', 'get').mockReturnValue(mockTracks);
  });

  describe('applySelectedMultiFieldChange', () => {
    let removeSpy: MockInstance;
    let addSpy: MockInstance;

    beforeEach(() => {
      removeSpy = vi.spyOn(tagEditor, 'removeMultiFieldValue').mockImplementation(() => {});
      addSpy = vi.spyOn(tagEditor, 'addMultiFieldValue').mockImplementation(() => {});
    });

    it('oldValue がある場合、古い値を削除して新しい値を追加すること', () => {
      tagActions.applySelectedMultiFieldChange('artist', 'Old Artist', 'New Artist');

      expect(removeSpy).toHaveBeenCalledWith(mockTracks, 'artist', 'Old Artist');
      expect(addSpy).toHaveBeenCalledWith(mockTracks, 'artist', 'New Artist');
    });

    it('oldValue が undefined の場合、削除処理をスキップすること', () => {
      tagActions.applySelectedMultiFieldChange('artist', undefined, 'New Artist');

      expect(removeSpy).not.toHaveBeenCalled();
      expect(addSpy).toHaveBeenCalledWith(mockTracks, 'artist', 'New Artist');
    });

    it('newValue が空文字列の場合、追加処理をスキップすること', () => {
      tagActions.applySelectedMultiFieldChange('artist', 'Old Artist', '');

      expect(removeSpy).toHaveBeenCalledWith(mockTracks, 'artist', 'Old Artist');
      expect(addSpy).not.toHaveBeenCalled();
    });
  });

  describe('removeSelectedMultiFieldValue', () => {
    it('選択中のトラックから指定された値を削除すること', () => {
      const removeSpy = vi.spyOn(tagEditor, 'removeMultiFieldValue').mockImplementation(() => {});

      tagActions.removeSelectedMultiFieldValue('artist', 'Remove Me');

      expect(removeSpy).toHaveBeenCalledWith(mockTracks, 'artist', 'Remove Me');
    });
  });

  describe('revertSelected', () => {
    it('変更がある選択中トラックを元に戻すこと', async () => {
      const track = mockTracks[0];
      track.metadata.title = 'Modified';
      expect(track.isModified).toBe(true);

      const startLoadingSpy = vi.spyOn(uiState, 'startLoading');
      const stopLoadingSpy = vi.spyOn(uiState, 'stopLoading');
      const readMetadataSpy = vi.spyOn(tagRepository, 'readMetadata').mockResolvedValue({
        type: 'success',
        value: { path: track.path, metadata: { title: 'Original' } }
      });

      await tagActions.revertSelected();

      expect(startLoadingSpy).toHaveBeenCalled();
      expect(readMetadataSpy).toHaveBeenCalledWith(track.path);
      expect(track.metadata.title).toBe('Original');
      expect(track.isModified).toBe(false);
      expect(stopLoadingSpy).toHaveBeenCalled();
    });

    it('変更がない場合は何もしないこと', async () => {
      const track = mockTracks[0];
      track.markAsSaved();
      const readMetadataSpy = vi.spyOn(tagRepository, 'readMetadata');

      await tagActions.revertSelected();

      expect(readMetadataSpy).not.toHaveBeenCalled();
    });
  });

  describe('saveAllModified', () => {
    it('変更がある全トラックを保存すること', async () => {
      const track = mockTracks[0];
      track.metadata.title = 'New Title';
      expect(track.isModified).toBe(true);

      const startLoadingSpy = vi.spyOn(uiState, 'startLoading');
      const stopLoadingSpy = vi.spyOn(uiState, 'stopLoading');
      const saveTracksSpy = vi.spyOn(tagRepository, 'saveTracks').mockResolvedValue({
        type: 'success',
        value: undefined
      });

      await tagActions.saveAllModified();

      expect(startLoadingSpy).toHaveBeenCalled();
      expect(saveTracksSpy).toHaveBeenCalledWith([track.toFlacTrack()]);
      expect(track.isModified).toBe(false);
      expect(stopLoadingSpy).toHaveBeenCalled();
    });

    it('変更がない場合は保存処理をスキップすること', async () => {
      const track = mockTracks[0];
      track.markAsSaved();
      const saveTracksSpy = vi.spyOn(tagRepository, 'saveTracks');

      await tagActions.saveAllModified();

      expect(saveTracksSpy).not.toHaveBeenCalled();
    });
  });
});
