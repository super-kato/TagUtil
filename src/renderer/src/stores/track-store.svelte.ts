import { deriveCommonMetadata } from '@domain/editor/batch-metadata';
import { DEFAULT_GENRES } from '@domain/flac/constants';
import { createImageUrl } from '@renderer/utils/image';
import { selectionState } from './selection-state.svelte';
import { TrackRecord } from './track-record.svelte';

/** UIが参照するトラックの読込・編集状態を管理するストア */
class TrackStore {
  tracks = $state<TrackRecord[]>([]);

  selectedTracks = $derived(this.tracks.filter((t) => selectionState.has(t)));

  /** 各トラック間で共通の値を導出（Mixed Values） */
  commonMetadata = $derived(deriveCommonMetadata(this.selectedTracks.map((t) => t.metadata)));

  /** 選択されたトラック間で共通のカバーアートURL */
  commonImageUrl = $derived.by(() => {
    const picState = this.commonMetadata?.picture;
    return picState?.type === 'uniform' ? createImageUrl(picState.value) : null;
  });

  /** ロード済みの全トラックから、サジェスト用のユニークなジャンルリストを導出 */
  allGenres = $derived.by(() => {
    const currentGenres = this.tracks
      .flatMap((t) => t.metadata.genre || [])
      .filter((g): g is string => !!g);
    return [...new Set([...DEFAULT_GENRES, ...currentGenres])].sort();
  });
}

export const trackStore = new TrackStore();
