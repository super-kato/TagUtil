import type { AppResult } from '@domain/flac/types';
import type { AppSettings } from '@shared/settings';

/**
 * アプリケーション設定の永続化・取得を担当するリポジトリ。
 * Electron IPC経由でメインプロセスの SettingsStore と通信します。
 */
const getSettings = async (): Promise<AppResult<AppSettings>> => {
  return await window.api.getSettings();
};

const updateSettings = async (settings: Partial<AppSettings>): Promise<AppResult<void>> => {
  return await window.api.updateSettings(settings);
};

export const settingsRepository = {
  getSettings,
  updateSettings
} as const;
