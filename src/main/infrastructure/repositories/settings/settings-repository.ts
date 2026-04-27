import { TAG_PLACEHOLDERS } from '@domain/audio/constants';

import type { AppSettings } from '@shared/settings';
import Store from 'electron-store';

const SETTINGS_FILE_NAME = 'tagutil-settings';

/**
 * アプリケーションのデフォルト設定値。
 * ドメイン知識（プレースホルダ）に依存するため、メインプロセス側のリポジトリ層で定義します。
 */
export const DEFAULT_SETTINGS: AppSettings = {
  renamePattern: `${TAG_PLACEHOLDERS.TRACK_NUMBER} - ${TAG_PLACEHOLDERS.TITLE}`,
  trackNumberPadding: 2,
  theme: 'system',
  genres: [
    'Pop',
    'Soundtrack',
    'Jazz',
    'Anime',
    'Game',
    'Classical',
    'Rock',
    'Instrumental',
    'Electronic'
  ],
  quickGenres: ['Pop', 'Soundtrack', 'Jazz', 'Anime']
};

/**
 * electron-store を使用してアプリケーション設定を永続化・管理するリポジトリ。
 */
export class SettingsRepository {
  #store: Store<AppSettings>;

  constructor() {
    this.#store = new Store<AppSettings>({
      name: SETTINGS_FILE_NAME,
      defaults: DEFAULT_SETTINGS,
      clearInvalidConfig: true
    });
  }

  /**
   * 現在の設定を取得します。
   */
  get settings(): AppSettings {
    return this.#store.store;
  }

  /**
   * 設定を更新します。
   * @param settings 更新する設定項目（部分更新）
   */
  updateSettings(settings: Partial<AppSettings>): void {
    for (const [key, value] of Object.entries(settings)) {
      if (value === undefined || value === null) {
        continue;
      }
      this.#store.set(key, value);
    }
  }
}

/**
 * SettingsRepository のシングルトンインスタンス。
 */
export const settingsRepository = new SettingsRepository();
