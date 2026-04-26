/**
 * アプリケーションのテーマ（カラーモード）を管理するストア。
 */
export type Theme = 'default' | 'pop';

class ThemeStore {
  #current = $state<Theme>('default');

  get current(): Theme {
    return this.#current;
  }

  setTheme(theme: Theme): void {
    this.#current = theme;
  }

  toggleTheme(): void {
    this.#current = this.#current === 'default' ? 'pop' : 'default';
  }
}

export const themeStore = new ThemeStore();
