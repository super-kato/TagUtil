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

  /**
   * 指定した1つのトラックのみを選択状態にします。
   */
  selectSingle(track: SelectionTarget, index: number): void {
    this.paths.clear();
    this.paths.add(track.path);
    this.lastSelectedIndex = index;
  }

  /** 指定された範囲のトラックを選択状態に追加します */
  selectRange(tracks: SelectionTarget[]): void {
    for (const track of tracks) {
      this.paths.add(track.path);
    }
  }

  /** 指定されたすべてのトラックを選択状態にします */
  selectAll(tracks: SelectionTarget[]): void {
    for (const track of tracks) {
      this.paths.add(track.path);
    }
    this.lastSelectedIndex = tracks.length > 0 ? tracks.length - 1 : null;
  }

  /**
   * 次のトラックを選択します。
   */
  selectNext(tracks: SelectionTarget[]): void {
    const next = this.lastSelectedIndex === null ? 0 : this.lastSelectedIndex + 1;
    this.#selectIndex(next, tracks);
  }

  /**
   * 前のトラックを選択します。
   */
  selectPrevious(tracks: SelectionTarget[]): void {
    const prev = this.lastSelectedIndex === null ? tracks.length - 1 : this.lastSelectedIndex - 1;
    this.#selectIndex(prev, tracks);
  }

  /**
   * インデックスを指定してトラックを選択します（範囲外はクランプされます）。
   */
  #selectIndex(index: number, tracks: SelectionTarget[]): void {
    if (tracks.length === 0) {
      return;
    }

    const clampedIndex = clamp(index, 0, tracks.length - 1);
    this.selectSingle(tracks[clampedIndex], clampedIndex);
  }
}

export const selectionState = new SelectionState();
