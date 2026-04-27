import { settingsRepository } from '@renderer/infrastructure/repositories/settings-repository';
import type { AppSettings } from '@shared/settings';

/**
 * アプリケーション設定を管理するストア。
 * IPC経由でメインプロセスと通信し、設定を同期します。
 */
export class SettingsStore {
  /** 現在の設定値（リアクティブ）。読み込み完了までは undefined。 */
  current = $state<AppSettings | undefined>(undefined);

  constructor() {
    this.refresh();
  }

  /**
   * メインプロセスから最新の設定を読み込みます。
   */
  async refresh(): Promise<void> {
    const result = await settingsRepository.getSettings();
    if (result.type !== 'success') {
      return;
    }

    this.current = result.value;
  }

  /**
   * 現在のメモリ上の設定をディスクに保存します。
   */
  async save(): Promise<void> {
    if (!this.current) {
      return;
    }
    const snapshot = $state.snapshot(this.current);
    const result = await settingsRepository.updateSettings(snapshot);
    if (result.type !== 'success') {
      return;
    }
    await this.refresh();
  }
}

export const settingsStore = new SettingsStore();
