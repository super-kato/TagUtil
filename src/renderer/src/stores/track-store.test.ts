import { describe, it, expect, vi, beforeEach } from 'vitest';
import { trackStore } from './track-store.svelte';
import { selectionState } from './selection-state.svelte';
import { TrackRecord } from './track-record.svelte';
import { DEFAULT_GENRES, type FlacMetadata } from '@domain/flac/types';

vi.mock('@renderer/utils/image', () => ({
  createImageUrl: vi.fn((pic) => (pic ? 'blob:mock' : null))
}));

describe('TrackStore', () => {
  beforeEach(() => {
    trackStore.tracks = [];
    selectionState.items.clear();
  });

  it('初期状態では tracks が空であること', () => {
    expect(trackStore.tracks).toEqual([]);
    expect(trackStore.selectedTracks).toEqual([]);
  });

  it('selectedTracks が選択状態に応じて正しくフィルタリングされること', () => {
    const t1 = new TrackRecord('p1', { title: 'T1' } as FlacMetadata);
    const t2 = new TrackRecord('p2', { title: 'T2' } as FlacMetadata);
    trackStore.tracks = [t1, t2];

    selectionState.selectSingle(t1, 0);
    expect(trackStore.selectedTracks).toEqual([t1]);

    selectionState.items.add(t2); // もしくは selectRange([t1, t2])
    expect(trackStore.selectedTracks).toEqual([t1, t2]);
  });

  it('allGenres がデフォルトジャンルとトラック内のジャンルをマージしてソートすること', () => {
    const t1 = new TrackRecord('p1', { genre: ['Rock', 'Jazz'] } as FlacMetadata);
    const t2 = new TrackRecord('p2', { genre: ['Pop'] } as FlacMetadata);
    trackStore.tracks = [t1, t2];

    const genres = trackStore.allGenres;
    expect(genres).toContain('Rock');
    expect(genres).toContain('Jazz');
    expect(genres).toContain('Pop');
    expect(genres).toContain(DEFAULT_GENRES[0]);
    // 重複がないこと
    const uniqueGenres = [...new Set(genres)];
    expect(genres.length).toBe(uniqueGenres.length);
    // ソートされていること
    const sorted = [...genres].sort();
    expect(genres).toEqual(sorted);
  });

  it('commonMetadata が選択中のトラックから導出されること', () => {
    const t1 = new TrackRecord('p1', { title: 'T1', artist: ['Artist'] } as FlacMetadata);
    const t2 = new TrackRecord('p2', { title: 'T2', artist: ['Artist'] } as FlacMetadata);
    trackStore.tracks = [t1, t2];
    selectionState.selectRange([t1, t2]);

    const artistState = trackStore.commonMetadata?.artist;
    expect(artistState?.type).toBe('uniform');
    if (artistState?.type === 'uniform') {
      expect(artistState.value).toEqual(['Artist']);
    }
    expect(trackStore.commonMetadata?.title.type).toBe('divergent');
  });
});
