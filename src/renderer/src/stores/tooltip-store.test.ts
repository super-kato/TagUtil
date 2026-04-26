import { describe, expect, it } from 'vitest';
import { tooltipStore } from './tooltip-store.svelte';

describe('TooltipStore', () => {
  it('初期状態は非表示であること', () => {
    expect(tooltipStore.isVisible).toBe(false);
    expect(tooltipStore.text).toBe('');
    expect(tooltipStore.anchorName).toBe('');
  });

  it('show を呼ぶと表示状態になり、テキストとアンカー名が保持されること', () => {
    tooltipStore.show('Hello World', '--anchor-1');

    expect(tooltipStore.isVisible).toBe(true);
    expect(tooltipStore.text).toBe('Hello World');
    expect(tooltipStore.anchorName).toBe('--anchor-1');
  });

  it('hide を呼ぶと非表示状態になること', () => {
    tooltipStore.show('Test', '--test');
    tooltipStore.hide();

    expect(tooltipStore.isVisible).toBe(false);
    // テキストなどは残っていてもよいが、isVisible が優先
  });
});
