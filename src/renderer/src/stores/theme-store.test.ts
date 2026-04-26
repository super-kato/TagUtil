import { describe, it, expect } from 'vitest';
import { themeStore } from './theme-store.svelte';

describe('ThemeStore', () => {
  it('デフォルトのテーマは "default" であること', () => {
    expect(themeStore.current).toBe('default');
  });

  it('setTheme でテーマを変更できること', () => {
    themeStore.setTheme('pop');
    expect(themeStore.current).toBe('pop');
    themeStore.setTheme('default');
    expect(themeStore.current).toBe('default');
  });

  it('toggleTheme でテーマを切り替えられること', () => {
    themeStore.setTheme('default');
    themeStore.toggleTheme();
    expect(themeStore.current).toBe('pop');
    themeStore.toggleTheme();
    expect(themeStore.current).toBe('default');
  });
});
