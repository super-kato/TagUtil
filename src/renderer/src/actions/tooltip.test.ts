/**
 * @vitest-environment jsdom
 */
import { tooltipStore } from '@renderer/stores/tooltip-store.svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { tooltip } from './tooltip';

describe('tooltip action', () => {
  let node: HTMLElement;
  const SHOW_DELAY = 500;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    node = document.createElement('div');
  });

  it('mouseenter で一定時間後にツールチップが表示されること', () => {
    const showSpy = vi.spyOn(tooltipStore, 'show');
    tooltip(node, 'Test Tooltip');

    node.dispatchEvent(new MouseEvent('mouseenter'));

    // まだ表示されない（ディレイ中）
    expect(showSpy).not.toHaveBeenCalled();

    // ディレイ時間経過後
    vi.advanceTimersByTime(SHOW_DELAY);
    expect(showSpy).toHaveBeenCalledWith(
      'Test Tooltip',
      expect.stringContaining('--tooltip-anchor-')
    );
  });

  it('mouseleave でツールチップが非表示になること', () => {
    const hideSpy = vi.spyOn(tooltipStore, 'hide');
    tooltip(node, 'Test Tooltip');

    node.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(SHOW_DELAY);

    node.dispatchEvent(new MouseEvent('mouseleave'));
    expect(hideSpy).toHaveBeenCalled();
  });

  it('テキストが空の場合は表示されないこと', () => {
    const showSpy = vi.spyOn(tooltipStore, 'show');
    tooltip(node, '');

    node.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(SHOW_DELAY);

    expect(showSpy).not.toHaveBeenCalled();
  });

  it('表示前に mouseleave した場合、タイマーが解除されること', () => {
    const showSpy = vi.spyOn(tooltipStore, 'show');
    tooltip(node, 'Test');

    node.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(SHOW_DELAY / 2);

    node.dispatchEvent(new MouseEvent('mouseleave'));
    vi.advanceTimersByTime(SHOW_DELAY);
    expect(showSpy).not.toHaveBeenCalled();
  });

  it('テキストが更新された場合、次の表示に反映されること', () => {
    const showSpy = vi.spyOn(tooltipStore, 'show');
    const action = tooltip(node, 'Old Text') as { update: (t: string) => void };

    action.update('New Text');
    node.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(SHOW_DELAY);

    expect(showSpy).toHaveBeenCalledWith('New Text', expect.any(String));
  });

  it('destroy 時にイベントリスナーが解除されること', () => {
    const showSpy = vi.spyOn(tooltipStore, 'show');
    const action = tooltip(node, 'Test') as { destroy: () => void };

    action.destroy();
    node.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(SHOW_DELAY);

    expect(showSpy).not.toHaveBeenCalled();
  });
});
