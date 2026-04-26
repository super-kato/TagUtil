import { describe, it, expect, vi, beforeEach } from 'vitest';
import { themeStore } from './theme-store.svelte';
import type { AppSettings } from '@shared/settings';

vi.mock('./settings-store.svelte', () => {
  let theme = 'default';
  return {
    settingsStore: {
      get current() {
        return { theme } as Partial<AppSettings>;
      },
      update: vi.fn(async (settings: Partial<AppSettings>) => {
        if (settings.theme) {
          theme = settings.theme;
        }
      })
    }
  };
});

describe('ThemeStore', () => {
  beforeEach(() => {
    // リセット（モックの実装に依存するが、ここでは簡易的に）
    themeStore.setTheme('default');
  });

  it('デフォルトのテーマは "default" であること', () => {
    expect(themeStore.current).toBe('default');
  });

  it('setTheme でテーマを変更できること', async () => {
    await themeStore.setTheme('light');
    expect(themeStore.current).toBe('light');
    await themeStore.setTheme('default');
    expect(themeStore.current).toBe('default');
  });

  it('toggleTheme でテーマを切り替えられること', async () => {
    await themeStore.setTheme('default');
    await themeStore.toggleTheme();
    expect(themeStore.current).toBe('light');
    await themeStore.toggleTheme();
    expect(themeStore.current).toBe('default');
  });
});
