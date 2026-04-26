import { beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { TrackRecord } from '@renderer/stores/track-record.svelte';
import { trackStore } from '@renderer/stores/track-store.svelte';
import { uiState } from '@renderer/stores/ui-state.svelte';
import { selectionState } from '@renderer/stores/selection-state.svelte';
import { tagRepository } from '@renderer/infrastructure/repositories/tag-repository';
import { tagActions } from './tag-actions';
import { tagEditor } from './tag-editor';
import type { FlacMetadata } from '@domain/flac/models';
import { logStore } from '@renderer/stores/log-store.svelte';
import { failure, success } from '@domain/common/result';
import type { TagError } from '@domain/flac/errors';

vi.mock('@renderer/stores/log-store.svelte', () => ({
  logStore: {
    addError: vi.fn(),
    addWarn: vi.fn(),
    addInfo: vi.fn()
  }
}));

vi.mock('@renderer/infrastructure/repositories/tag-repository', () => ({
  tagRepository: {
    scanAndLoadTracks: vi.fn(),
    loadTracksFromPaths: vi.fn(),
    readMetadata: vi.fn(),
    saveTracks: vi.fn(),
    pickImage: vi.fn(),
    getImageInfo: vi.fn()
  }
}));

describe('tagActions', () => {
  const metadata: FlacMetadata = { title: 'T' };
  const mockTracks = [new TrackRecord('file1.flac', metadata)];

  beforeEach(() => {
    vi.clearAllMocks();
    // ストアの実体を使用し、状態をセットアップ
    trackStore.tracks = [...mockTracks];
    selectionState.items.clear();
    mockTracks.forEach((t) => selectionState.items.add(t));

    // デフォルトの成功レスポンスをセット
    vi.mocked(tagRepository.readMetadata).mockResolvedValue(success({ path: 'p', metadata: {} }));
    vi.mocked(tagRepository.saveTracks).mockResolvedValue(success(undefined));
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

  describe('openAndScanDirectory', () => {
    it('リポジトリを呼び出し、取得したトラックをストアに保存すること', async () => {
      const startLoadingSpy = vi.spyOn(uiState, 'startLoading');
      const stopLoadingSpy = vi.spyOn(uiState, 'stopLoading');
      const scanSpy = vi.spyOn(tagRepository, 'scanAndLoadTracks').mockResolvedValue({
        type: 'success',
        value: { tracks: [{ path: 'test.flac', metadata: { title: 'Test' } }], isLimited: false }
      });

      await tagActions.openAndScanDirectory();

      expect(startLoadingSpy).toHaveBeenCalled();
      expect(scanSpy).toHaveBeenCalled();
      expect(trackStore.tracks.length).toBe(1);
      expect(trackStore.tracks[0].path).toBe('test.flac');
      expect(stopLoadingSpy).toHaveBeenCalled();
    });
  });

  describe('pickAndApplyPicture', () => {
    it('画像を選択し、エディタを介して適用すること', async () => {
      const picture = { format: 'image/jpeg', sourcePath: 'img.jpg', hash: 'h' };
      vi.spyOn(tagRepository, 'pickImage').mockResolvedValue({ type: 'success', value: picture });
      const applySpy = vi.spyOn(tagEditor, 'applyPicture');

      await tagActions.pickAndApplyPicture();

      expect(applySpy).toHaveBeenCalledWith(mockTracks, picture);
    });
  });

  describe('applyAutoNumbering', () => {
    it('エディタの自動採番を呼び出すこと', () => {
      const applySpy = vi.spyOn(tagEditor, 'applyAutoNumbering');
      tagActions.applyAutoNumbering();
      expect(applySpy).toHaveBeenCalledWith(mockTracks);
    });
  });

  describe('removeArtwork', () => {
    it('エディタの画像削除を呼び出すこと', () => {
      const removeSpy = vi.spyOn(tagEditor, 'removePicture');
      tagActions.removeArtwork();
      expect(removeSpy).toHaveBeenCalledWith(mockTracks);
    });
  });

  describe('error and edge cases', () => {
    it('スキャンエラー時にレンダラー側でログを重複して記録しないこと', async () => {
      const error: TagError = { type: 'SCAN_FAILED', options: { path: '/dir' } };
      vi.mocked(tagRepository.loadTracksFromPaths).mockResolvedValue(failure(error));

      await tagActions.loadFromPaths(['/dir']);

      expect(logStore.addError).not.toHaveBeenCalled();
    });

    it('スキャン件数制限を超えた場合に警告をログに記録すること', async () => {
      vi.mocked(tagRepository.loadTracksFromPaths).mockResolvedValue(
        success({ tracks: [], isLimited: true })
      );

      await tagActions.loadFromPaths(['/dir']);

      expect(logStore.addWarn).toHaveBeenCalledWith(
        expect.objectContaining({ context: 'TagActions' })
      );
    });

    it('一括保存エラー時にレンダラー側でログを重複して記録しないこと', async () => {
      const error: TagError = { type: 'WRITE_FAILED', options: { path: 'a.flac' } };
      vi.mocked(tagRepository.saveTracks).mockResolvedValue(failure(error));
      trackStore.tracks = [new TrackRecord('a.flac', {})];
      trackStore.tracks[0].metadata.title = 'New';

      await tagActions.saveAllModified();

      expect(logStore.addError).not.toHaveBeenCalled();
    });

    it('画像選択エラー時にレンダラー側でログを重複して記録しないこと', async () => {
      const error: TagError = { type: 'PICK_IMAGE_FAILED', options: { path: '' } };
      vi.spyOn(tagRepository, 'pickImage').mockResolvedValue(failure(error));

      await tagActions.pickAndApplyPicture();

      expect(logStore.addError).not.toHaveBeenCalled();
    });
  });
});
