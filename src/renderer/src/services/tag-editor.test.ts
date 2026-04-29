import { describe, it, expect } from 'vitest';
import { tagEditor } from './tag-editor';
import { TrackRecord } from '@renderer/stores/track-record.svelte';
import type { FlacMetadata } from '@domain/flac/models';

describe('tagEditor', () => {
  const createMockTrack = (path: string, metadata: Partial<FlacMetadata> = {}): TrackRecord => {
    return new TrackRecord(path, {
      title: 'T',
      artist: ['A'],
      album: 'Al',
      ...metadata
    } as FlacMetadata);
  };

  it('updateSingleField で全トラックの指定フィールドを更新できること', () => {
    const tracks = [createMockTrack('1.flac'), createMockTrack('2.flac')];
    tagEditor.updateSingleField(tracks, 'title', 'New Title');
    expect(tracks[0].metadata.title).toBe('New Title');
    expect(tracks[1].metadata.title).toBe('New Title');
  });

  it('updateMultiField で複数値フィールドの特定インデックスを更新できること', () => {
    const tracks = [createMockTrack('1.flac', { artist: ['A1', 'A2'] })];
    tagEditor.updateMultiField(tracks, 'artist', 1, 'New Artist');
    expect(tracks[0].metadata.artist?.[1]).toBe('New Artist');
  });

  it('addMultiFieldValue で複数値フィールドに値を追加し、重複を避けること', () => {
    const tracks = [createMockTrack('1.flac', { artist: ['A1'] })];

    // 新しい値を追加
    tagEditor.addMultiFieldValue(tracks, 'artist', 'A2');
    expect(tracks[0].metadata.artist).toEqual(['A1', 'A2']);

    // 重複する値は追加されない
    tagEditor.addMultiFieldValue(tracks, 'artist', 'A1');
    expect(tracks[0].metadata.artist).toEqual(['A1', 'A2']);

    // 空文字列も追加できる（初期状態作成用など）
    tagEditor.addMultiFieldValue(tracks, 'artist', '');
    expect(tracks[0].metadata.artist).toEqual(['A1', 'A2', '']);
  });

  it('removeMultiFieldValue で複数値フィールドから値を削除できること', () => {
    const tracks = [createMockTrack('1.flac', { artist: ['A1', 'A2', 'A1'] })];
    tagEditor.removeMultiFieldValue(tracks, 'artist', 'A1');
    expect(tracks[0].metadata.artist).toEqual(['A2']);
  });

  it('applyPicture で全トラックに画像を適用できること', () => {
    const tracks = [createMockTrack('1.flac')];
    const picture = { format: 'image/jpeg', sourcePath: 'p', hash: 'h' };
    tagEditor.applyPicture(tracks, picture);
    expect(tracks[0].metadata.picture).toEqual(picture);
  });

  it('removePicture で全トラックから画像を削除できること', () => {
    const tracks = [
      createMockTrack('1.flac', { picture: { format: 'f', sourcePath: 's', hash: 'h' } })
    ];
    tagEditor.removePicture(tracks);
    expect(tracks[0].metadata.picture).toBeNull();
  });

  it('applyAutoNumbering でトラック番号と総トラック数を適用できること', () => {
    const tracks = [createMockTrack('1.flac'), createMockTrack('2.flac')];
    tagEditor.applyAutoNumbering(tracks);
    expect(tracks[0].metadata.trackNumber).toBe('1');
    expect(tracks[0].metadata.trackTotal).toBe('2');
    expect(tracks[1].metadata.trackNumber).toBe('2');
    expect(tracks[1].metadata.trackTotal).toBe('2');
  });
});
