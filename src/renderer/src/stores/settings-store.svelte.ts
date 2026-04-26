import { settingsRepository } from '@renderer/infrastructure/repositories/settings-repository';
import type { AppSettings } from '@shared/settings';

/**
 * アプリケーション設定を管理するストア。
 * IPC経由でメインプロセスと通信し、設定を同期します。
 */
export class SettingsStore {
  /** 現在の設定値（リアクティブ）。読み込み完了までは undefined。 */
  #current = $state<AppSettings | undefined>(undefined);

  constructor() {
    this.refresh();
  }

  /**
   * 現在の設定を取得します。
   * 読み込みが完了していない場合は undefined を返します。
   */
  get current(): AppSettings | undefined {
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
}
