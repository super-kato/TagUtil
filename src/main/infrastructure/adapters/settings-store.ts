import Store from 'electron-store';
import { DEFAULT_SETTINGS, type AppSettings } from '@shared/settings';

/**
 * electron-store を使用してアプリケーション設定を永続化・管理するクラス。
 */
export class SettingsStore {
  private store: Store<AppSettings>;

  constructor() {
    this.store = new Store<AppSettings>({
      defaults: DEFAULT_SETTINGS
    });
  }

  /**
   * 現在の設定をすべて取得します。
   */
  getSettings(): AppSettings {
    return {
      renamePattern: this.store.get('renamePattern'),
      trackNumberPadding: this.store.get('trackNumberPadding')
    };
  }

  /**
   * 設定を更新します。
   * @param settings 更新する設定のサブセット
   */
  updateSettings(settings: Partial<AppSettings>): void {
    if (settings.renamePattern !== undefined) {
      this.store.set('renamePattern', settings.renamePattern);
    }
    if (settings.trackNumberPadding !== undefined) {
      this.store.set('trackNumberPadding', settings.trackNumberPadding);
    }
  }

  /**
   * 特定のキーの設定を取得します。
   */
  get<K extends keyof AppSettings>(key: K): AppSettings[K] {
    return this.store.get(key);
  }
}

/**
 * シングルトンインスタンス。
 */
export const settingsStore = new SettingsStore();
