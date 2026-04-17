import { describe, it, expect, beforeEach } from 'vitest';
import { selectionState, type SelectionTarget } from './selection-state.svelte';

describe('SelectionState', () => {
  const mockTracks: SelectionTarget[] = [{ path: 'path1' }, { path: 'path2' }, { path: 'path3' }];

  beforeEach(() => {
    selectionState.paths.clear();
    selectionState.lastSelectedIndex = null;
  });

  it('初期状態では選択がなく、インデックスも null であること', () => {
    expect(selectionState.paths.size).toBe(0);
    expect(selectionState.lastSelectedIndex).toBe(null);
  });

  it('selectSingle でインデックスが正しく更新されること', () => {
    selectionState.selectSingle(mockTracks[1], 1);
    expect(selectionState.has(mockTracks[1])).toBe(true);
    expect(selectionState.lastSelectedIndex).toBe(1);
  });

  it('selectNext で次の項目が選択されること', () => {
    selectionState.selectSingle(mockTracks[0], 0);
    selectionState.selectNext(mockTracks);
    expect(selectionState.lastSelectedIndex).toBe(1);
    expect(selectionState.has(mockTracks[1])).toBe(true);
    expect(selectionState.has(mockTracks[0])).toBe(false);
  });

  it('selectPrevious で前の項目が選択されること', () => {
    selectionState.selectSingle(mockTracks[2], 2);
    selectionState.selectPrevious(mockTracks);
    expect(selectionState.lastSelectedIndex).toBe(1);
    expect(selectionState.has(mockTracks[1])).toBe(true);
  });

  it('末尾で selectNext を呼んでも範囲外にならないこと', () => {
    selectionState.selectSingle(mockTracks[2], 2);
    selectionState.selectNext(mockTracks);
    expect(selectionState.lastSelectedIndex).toBe(2);
  });

  it('先頭で selectPrevious を呼んでも範囲外にならないこと', () => {
    selectionState.selectSingle(mockTracks[0], 0);
    selectionState.selectPrevious(mockTracks);
    expect(selectionState.lastSelectedIndex).toBe(0);
  });

  it('未選択状態で selectNext を呼ぶと先頭が選択されること', () => {
    selectionState.selectNext(mockTracks);
    expect(selectionState.lastSelectedIndex).toBe(0);
  });

  it('未選択状態で selectPrevious を呼ぶと末尾が選択されること', () => {
    selectionState.selectPrevious(mockTracks);
    expect(selectionState.lastSelectedIndex).toBe(2);
  });
});
