import { clamp } from '@shared/utils/number';
import { SvelteSet } from 'svelte/reactivity';
import { TrackRecord } from './track-record.svelte';

/** 選択・移動の対象となる最小限のインターフェース */
export type SelectionTarget = Pick<TrackRecord, 'path'>;

/**
 * 複数ファイルの選択状態を管理する独立したストア。
 * 外部インターフェースには `SelectionTarget` を受け取り、
 * 内部的には一意となる `path` の文字列を SvelteSet で管理します。
 */
class SelectionState {
  paths = new SvelteSet<string>();
  /** 最後に選択（クリックやキー移動）されたトラックのインデックス */
  lastSelectedIndex = $state<number | null>(null);

  /** 特定のトラックが選択されているかどうかを返します */
  has(track: SelectionTarget): boolean {
    return this.paths.has(track.path);
  }

  selectSingle(track: SelectionTarget, index: number): void {
    this.paths.clear();
    this.paths.add(track.path);
    this.lastSelectedIndex = index;
  }

  selectRange(tracks: SelectionTarget[]): void {
    for (const track of tracks) {
      this.paths.add(track.path);
    }
  }

  selectAll(tracks: SelectionTarget[]): void {
    for (const track of tracks) {
      this.paths.add(track.path);
    }
    this.lastSelectedIndex = tracks.length > 0 ? tracks.length - 1 : null;
  }

  selectNext(tracks: SelectionTarget[]): void {
    const next = this.lastSelectedIndex === null ? 0 : this.lastSelectedIndex + 1;
    this.#selectIndex(next, tracks);
  }

  selectPrevious(tracks: SelectionTarget[]): void {
    const prev = this.lastSelectedIndex === null ? tracks.length - 1 : this.lastSelectedIndex - 1;
    this.#selectIndex(prev, tracks);
  }

  #selectIndex(index: number, tracks: SelectionTarget[]): void {
    if (tracks.length === 0) {
      return;
    }

    const clampedIndex = clamp(index, 0, tracks.length - 1);
    this.selectSingle(tracks[clampedIndex], clampedIndex);
  }
}

export const selectionState = new SelectionState();
