import { describe, it, expect, vi, beforeEach } from 'vitest';
import { trackStore } from './track-store.svelte';
import { selectionState } from './selection-state.svelte';
import { TrackRecord } from './track-record.svelte';
import { DEFAULT_GENRES } from '@domain/flac/constants';
import type { FlacMetadata, Picture } from '@domain/flac/models';

import * as imageUtils from '@renderer/utils/image';

describe('TrackStore', () => {
  beforeEach(() => {
    vi.spyOn(imageUtils, 'createImageUrl').mockImplementation((pic) => (pic ? 'blob:mock' : null));
    trackStore.tracks = [];
    selectionState.items.clear();
  });

  it('初期状態では tracks が空であること', () => {
    expect(trackStore.tracks).toStrictEqual([]);
    expect(trackStore.selectedTracks).toStrictEqual([]);
  });

  it('selectedTracks が選択状態に応じて正しくフィルタリングされること', () => {
    const m1: FlacMetadata = { title: 'T1' };
    const m2: FlacMetadata = { title: 'T2' };
    const t1 = new TrackRecord('p1', m1);
    const t2 = new TrackRecord('p2', m2);
    trackStore.tracks = [t1, t2];

    selectionState.selectSingle(t1, 0);
    expect(trackStore.selectedTracks).toStrictEqual([t1]);

    selectionState.items.add(t2); // もしくは selectRange([t1, t2])
    expect(trackStore.selectedTracks).toStrictEqual([t1, t2]);
  });

  it('allGenres がデフォルトジャンルとトラック内のジャンルをマージしてソートすること', () => {
    const m1: FlacMetadata = { genre: ['Rock', 'Jazz'] };
    const m2: FlacMetadata = { genre: ['Pop'] };
    const t1 = new TrackRecord('p1', m1);
    const t2 = new TrackRecord('p2', m2);
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
    expect(genres).toStrictEqual(sorted);
  });

  it('commonMetadata が選択中のトラックから導出されること', () => {
    const m1: FlacMetadata = { title: 'T1', artist: ['Artist'] };
    const m2: FlacMetadata = { title: 'T2', artist: ['Artist'] };
    const t1 = new TrackRecord('p1', m1);
    const t2 = new TrackRecord('p2', m2);
    trackStore.tracks = [t1, t2];
    selectionState.selectRange([t1, t2]);

    const artistState = trackStore.commonMetadata?.artist;
    expect(artistState?.type).toBe('uniform');
    if (artistState?.type === 'uniform') {
      expect(artistState.value).toStrictEqual(['Artist']);
    }
    expect(trackStore.commonMetadata?.title.type).toBe('divergent');
  });

  it('commonImageUrl が選択中のトラックの共通カバーアートを返すこと', () => {
    const pic: Picture = { format: 'image/png', sourcePath: 'p', hash: 'h' };
    const m1: FlacMetadata = { picture: pic };
    const m2: FlacMetadata = { picture: pic };
    const t1 = new TrackRecord('p1', m1);
    const t2 = new TrackRecord('p2', m2);
    trackStore.tracks = [t1, t2];
    selectionState.selectRange([t1, t2]);

    expect(trackStore.commonImageUrl).toBe('blob:mock');
    expect(imageUtils.createImageUrl).toHaveBeenCalledWith(pic);
  });

  it('カバーアートが不一致の場合は commonImageUrl が null を返すこと', () => {
    const m1: FlacMetadata = { picture: { format: 'a', sourcePath: 'a', hash: 'a' } };
    const m2: FlacMetadata = { picture: { format: 'b', sourcePath: 'b', hash: 'b' } };
    const t1 = new TrackRecord('p1', m1);
    const t2 = new TrackRecord('p2', m2);
    trackStore.tracks = [t1, t2];
    selectionState.selectRange([t1, t2]);

    expect(trackStore.commonImageUrl).toBeNull();
  });
});
