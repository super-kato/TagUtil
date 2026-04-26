import Store from 'electron-store';
import { DEFAULT_SETTINGS, type AppSettings } from '@shared/settings';

/**
 * electron-store を使用してアプリケーション設定を永続化・管理するリポジトリ。
 */
export class SettingsRepository {
  #store: Store<AppSettings>;

  constructor() {
    this.#store = new Store<AppSettings>({
      defaults: DEFAULT_SETTINGS
    });
  }

  /**
   * 現在の設定をすべて取得します。
   */
  get settings(): Readonly<AppSettings> {
    return this.#store.store;
  }

  /**
   * 設定を更新します。
   * @param settings 更新する設定のサブセット
   */
  updateSettings(settings: Partial<AppSettings>): void {
    // 定義されている値のみをセットする
    Object.entries(settings).forEach(([key, value]) => {
      if (value !== undefined) {
        this.#store.set(key, value);
      }
    });
  }
}

/**
 * 設定リポジトリのシングルトンインスタンス。
 */
export const settingsRepository = new SettingsRepository();
