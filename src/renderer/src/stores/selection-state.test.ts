import { describe, it, expect, beforeEach } from 'vitest';
import { selectionState } from './selection-state.svelte';
import { TrackRecord } from './track-record.svelte';
import type { FlacMetadata } from '@domain/flac/types';

describe('SelectionState', () => {
  const m1: FlacMetadata = { title: 'T1' };
  const m2: FlacMetadata = { title: 'T2' };
  const m3: FlacMetadata = { title: 'T3' };
  const mockTracks = [
    new TrackRecord('path1', m1),
    new TrackRecord('path2', m2),
    new TrackRecord('path3', m3)
  ];

  beforeEach(() => {
    selectionState.items.clear();
    selectionState.lastSelectedIndex = null;
  });

  it('初期状態では選択がなく、インデックスも null であること', () => {
    expect(selectionState.items.size).toBe(0);
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

  it('selectRange で複数の項目が選択されること', () => {
    selectionState.selectRange([mockTracks[0], mockTracks[2]]);
    expect(selectionState.has(mockTracks[0])).toBe(true);
    expect(selectionState.has(mockTracks[2])).toBe(true);
    expect(selectionState.has(mockTracks[1])).toBe(false);
  });

  it('selectAll で全ての項目が選択され、最後のインデックスが更新されること', () => {
    selectionState.selectAll(mockTracks);
    expect(selectionState.items.size).toBe(3);
    expect(selectionState.has(mockTracks[0])).toBe(true);
    expect(selectionState.has(mockTracks[1])).toBe(true);
    expect(selectionState.has(mockTracks[2])).toBe(true);
    expect(selectionState.lastSelectedIndex).toBe(2);
  });

  it('空配列で selectAll を呼んだ場合にインデックスが null になること', () => {
    selectionState.selectAll([]);
    expect(selectionState.items.size).toBe(0);
    expect(selectionState.lastSelectedIndex).toBe(null);
  });
});
