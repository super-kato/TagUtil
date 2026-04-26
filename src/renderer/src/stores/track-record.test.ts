import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TrackRecord } from './track-record.svelte';
import type { FlacMetadata } from '@domain/flac/models';

import * as imageUtils from '@renderer/utils/image';

describe('TrackRecord', () => {
  beforeEach(() => {
    vi.spyOn(imageUtils, 'createImageUrl').mockImplementation((pic) => (pic ? 'blob:mock' : null));
  });
  const mockMetadata: FlacMetadata = {
    title: 'Test Title',
    artist: ['Test Artist'],
    album: 'Test Album',
    trackNumber: '1',
    genre: ['J-Pop']
  };

  it('インスタンス化時に初期状態を正しくスナップショットすること', () => {
    const track = new TrackRecord('test.flac', { ...mockMetadata });
    expect(track.path).toBe('test.flac');
    expect(track.isModified).toBe(false);
  });

  it('メタデータを変更すると isModified が true になること', () => {
    const track = new TrackRecord('test.flac', { ...mockMetadata });
    track.metadata.title = 'New Title';
    expect(track.isModified).toBe(true);
  });

  it('メタデータを元に戻すと isModified が false になること', () => {
    const track = new TrackRecord('test.flac', { ...mockMetadata });
    track.metadata.title = 'New Title';
    expect(track.isModified).toBe(true);
    track.metadata.title = 'Test Title';
    expect(track.isModified).toBe(false);
  });

  it('markAsSaved を呼ぶと現在の状態が新しいスナップショットになること', () => {
    const track = new TrackRecord('test.flac', { ...mockMetadata });
    track.metadata.title = 'New Title';
    expect(track.isModified).toBe(true);
    track.markAsSaved();
    expect(track.isModified).toBe(false);
  });

  it('toFlacTrack が現在の状態を正しく返すこと', () => {
    const track = new TrackRecord('test.flac', { ...mockMetadata });
    track.metadata.title = 'Export Title';
    const flacTrack = track.toFlacTrack();
    expect(flacTrack.path).toBe('test.flac');
    expect(flacTrack.metadata.title).toBe('Export Title');
  });
});
