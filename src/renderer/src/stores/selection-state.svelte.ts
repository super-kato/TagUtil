import { clamp } from '@shared/utils/number';
import { SvelteSet } from 'svelte/reactivity';
import { TrackRecord } from './track-record.svelte';

/**
 * 複数ファイルの選択状態を管理する独立したストア。
 * 内部的には TrackRecord インスタンスの参照を SvelteSet で管理します。
 */
class SelectionState {
  #items = new SvelteSet<TrackRecord>();
  /** 最後に選択（クリックやキー移動）されたトラックのインデックス */
  #lastSelectedIndex = $state<number | null>(null);

  get items(): ReadonlySet<TrackRecord> {
    return this.#items;
  }

  get lastSelectedIndex(): number | null {
    return this.#lastSelectedIndex;
  }

  /** 特定のトラックが選択されているかどうかを返します */
  has(track: TrackRecord): boolean {
    return this.#items.has(track);
  }

  selectSingle(track: TrackRecord, index: number): void {
    this.#items.clear();
    this.#items.add(track);
    this.#lastSelectedIndex = index;
  }

  selectRange(tracks: TrackRecord[]): void {
    for (const track of tracks) {
      this.#items.add(track);
    }
  }

  selectAll(tracks: TrackRecord[]): void {
    for (const track of tracks) {
      this.#items.add(track);
    }
    this.#lastSelectedIndex = tracks.length > 0 ? tracks.length - 1 : null;
  }

  selectNext(tracks: TrackRecord[]): void {
    const next = this.#lastSelectedIndex === null ? 0 : this.#lastSelectedIndex + 1;
    this.#selectIndex(next, tracks);
  }

  selectPrevious(tracks: TrackRecord[]): void {
    const prev = this.#lastSelectedIndex === null ? tracks.length - 1 : this.#lastSelectedIndex - 1;
    this.#selectIndex(prev, tracks);
  }

  clear(): void {
    this.#items.clear();
    this.#lastSelectedIndex = null;
  }

  #selectIndex(index: number, tracks: TrackRecord[]): void {
    if (tracks.length === 0) {
      return;
    }

    const clampedIndex = clamp(index, 0, tracks.length - 1);
    this.selectSingle(tracks[clampedIndex], clampedIndex);
  }
}

export const selectionState = new SelectionState();
