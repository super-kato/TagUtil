import { settingsStore } from './settings-store.svelte';

export type Theme = 'default' | 'light';

class ThemeStore {
  /**
   * 現在のテーマを取得します。
   * 設定が読み込まれるまでは 'default' を返します。
   */
  get current(): Theme {
    return settingsStore.current?.theme ?? 'default';
  }

  /**
   * テーマを更新します。
   * 設定を永続化するために settingsStore を更新します。
   */
  async setTheme(theme: Theme): Promise<void> {
    await settingsStore.update({ theme });
  }
}

export const themeStore = new ThemeStore();
