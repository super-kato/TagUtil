import { DEFAULT_SETTINGS, type AppSettings } from '@shared/settings';
import { settingsRepository } from '@renderer/infrastructure/repositories/settings-repository';

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
   * メインプロセスから最新の設定を読み込みます。
   */
  async refresh(): Promise<void> {
    const result = await settingsRepository.getSettings();
    if (result.type !== 'success') {
      return;
    }

    this.#current = result.value;
  }

  /**
   * 設定を更新します。
   * @param settings 更新する設定のサブセット
   */
  async update(settings: Partial<AppSettings>): Promise<void> {
    const result = await settingsRepository.updateSettings(settings);
    if (result.type !== 'success') {
      return;
    }

    // 成功したら最新の状態を再取得して同期する
    await this.refresh();
  }
}

/**
 * シングルトンインスタンス。
 */
export const settingsStore = new SettingsStore();
