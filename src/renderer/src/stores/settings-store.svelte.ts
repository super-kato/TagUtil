import { DEFAULT_SETTINGS, type AppSettings } from '@shared/settings';

/**
 * アプリケーション設定を管理するストア。
 * IPC経由でメインプロセスと通信し、設定を同期します。
 */
export class SettingsStore {
  /** 現在の設定値（リアクティブ） */
  #current = $state<AppSettings>(DEFAULT_SETTINGS);

  constructor() {
    // 初期化時に設定を読み込む
    this.refresh();
  }

  /**
   * 現在の設定を取得します。
   */
  get current(): AppSettings {
    return this.#current;
  }

  /**
   * メメインプロセスから最新の設定を読み込みます。
   */
  async refresh(): Promise<void> {
    try {
      const settings = await window.api.getSettings();
      this.#current = settings;
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  }

  /**
   * 設定を更新します。
   * @param settings 更新する設定のサブセット
   */
  async update(settings: Partial<AppSettings>): Promise<void> {
    try {
      await window.api.updateSettings(settings);
      // 成功したらローカルの状態も更新する
      this.#current = { ...this.#current, ...settings };
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  }
}

/**
 * シングルトンインスタンス。
 */
export const settingsStore = new SettingsStore();
