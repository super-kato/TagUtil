import { settingsRepository } from '@renderer/infrastructure/repositories/settings-repository';
import type { AppSettings } from '@shared/settings';

export const MAX_QUICK_GENRES = 4;

/** 文字列または数値の設定項目のキー */
type SimpleSettingsKeys = {
  [K in keyof AppSettings]: AppSettings[K] extends string | number ? K : never;
}[keyof AppSettings];

/**
 * アプリケーション設定を管理するストア。
 * IPC経由でメインプロセスと通信し、設定を同期します。
 */
export class SettingsStore {
  /** 現在の設定値（リアクティブ） */
  #current = $state<AppSettings | undefined>(undefined);

  /** 現在の設定値（外部からは読み取り専用） */
  get current(): AppSettings | undefined {
    return this.#current;
  }

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

    this.#current = result.value;
  }

  /**
   * 現在のメモリ上の設定をディスクに保存します。
   */
  async save(): Promise<void> {
    if (!this.#current) {
      return;
    }
    const snapshot = $state.snapshot(this.#current);
    const result = await settingsRepository.updateSettings(snapshot);
    if (result.type !== 'success') {
      return;
    }
    await this.refresh();
  }

  /**
   * 設定値を更新します（単純なプロパティ用）。
   */
  update<K extends SimpleSettingsKeys>(key: K, value: AppSettings[K]): void {
    if (!this.#current) {
      return;
    }
    this.#current[key] = value;
  }

  /**
   * ジャンルをリストに追加します。
   */
  addGenre(genre: string): void {
    if (!this.#current) {
      return;
    }
    this.#current.genres.push(genre);
  }

  /**
   * ジャンルをリストから削除し、クイックジャンルとも同期します。
   */
  removeGenre(genre: string): void {
    if (!this.#current) {
      return;
    }

    this.#current.genres = this.#current.genres.filter((g) => g !== genre);
    this.#current.quickGenres = this.#current.quickGenres.filter((g) => g !== genre);
  }

  /**
   * クイックジャンルの選択状態を切り替えます（最大数制限あり）。
   */
  toggleQuickGenre(genre: string): void {
    if (!this.#current) {
      return;
    }

    const isSelected = this.#current.quickGenres.includes(genre);

    if (isSelected) {
      this.#current.quickGenres = this.#current.quickGenres.filter((g) => g !== genre);
      return;
    }

    if (this.#current.quickGenres.length < MAX_QUICK_GENRES) {
      this.#current.quickGenres.push(genre);
    }
  }
}

export const settingsStore = new SettingsStore();
