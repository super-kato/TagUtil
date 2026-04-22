import { beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { TrackRecord } from '@renderer/stores/track-record.svelte';
import { trackStore } from '@renderer/stores/track-store.svelte';
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
});
