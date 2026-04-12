import { SvelteSet } from 'svelte/reactivity';
import type { TrackRecord } from './types';

/**
 * 複数ファイルの選択状態を管理する独立したストア。
 * 外部インターフェースには `TrackRecord` のオブジェクト参照を受け取り、
 * 内部的には一意となる `path` の文字列を SvelteSet で管理します。
 */
class SelectionState {
  paths = new SvelteSet<string>();

  /** 特定のトラックが選択されているかどうかを返します */
  has(track: TrackRecord): boolean {
    return this.paths.has(track.path);
  }

  /** 単一のトラックのみを選択状態にします（他は解除） */
  selectSingle(track: TrackRecord): void {
    this.paths.clear();
    this.paths.add(track.path);
  }

  /** 指定されたトラックの選択状態を反転させます */
  toggle(track: TrackRecord): void {
    if (this.paths.has(track.path)) {
      this.paths.delete(track.path);
    } else {
      this.paths.add(track.path);
    }
  }

  /** 指定された範囲のトラックを選択状態に追加します */
  selectRange(tracks: TrackRecord[]): void {
    for (const track of tracks) {
      this.paths.add(track.path);
    }
  }

  /** 指定されたすべてのトラックを選択状態にします */
  selectAll(tracks: TrackRecord[]): void {
    for (const track of tracks) {
      this.paths.add(track.path);
    }
  }
}

export const selectionState = new SelectionState();
