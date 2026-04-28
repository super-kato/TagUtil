import { TAG_PLACEHOLDERS } from '@domain/audio/constants';
import type { AppSettings } from '@shared/settings';
import Store from 'electron-store';
import { EventEmitter } from 'node:events';

const SETTINGS_FILE_NAME = 'tagutil-settings';

/**
 * アプリケーションのデフォルト設定値。
 * ドメイン知識（プレースホルダ）に依存するため、メインプロセス側のリポジトリ層で定義します。
 */
export const DEFAULT_SETTINGS: AppSettings = {
  renamePattern: `${TAG_PLACEHOLDERS.TRACK_NUMBER} - ${TAG_PLACEHOLDERS.TITLE}`,
  trackNumberPadding: 2,
  theme: 'system',
  logLevel: 'INFO',
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
 * 設定の変更を通知するための EventEmitter を継承しています。
 */
export class SettingsRepository extends EventEmitter {
  static readonly #CHANGED_EVENT = 'changed';
  #store: Store<AppSettings>;

  constructor() {
    super();
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
   * 設定を更新し、変更イベントを発行します。
   * @param settings 更新する設定項目（部分更新）
   */
  updateSettings(settings: Partial<AppSettings>): void {
    let changed = false;
    for (const [key, value] of Object.entries(settings)) {
      if (value === undefined || value === null) {
        continue;
      }
      this.#store.set(key, value);
      changed = true;
    }

    if (changed) {
      this.emit(SettingsRepository.#CHANGED_EVENT, this.settings);
    }
  }

  /**
   * 設定変更のリスナーを登録します。
   * @param handler 変更後の設定を受け取るハンドラ
   */
  onChange(handler: (settings: AppSettings) => void): void {
    this.on(SettingsRepository.#CHANGED_EVENT, handler);
  }
}

/**
 * SettingsRepository のシングルトンインスタンス。
 */
export const settingsRepository = new SettingsRepository();
