import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '@shared/ipc';
import { settingsStore } from '@main/infrastructure/adapters/settings-store';
import type { AppSettings } from '@shared/settings';

/**
 * 設定に関連する IPC ハンドラを登録します。
 */
export const registerSettingsHandlers = (): void => {
  ipcMain.handle(IPC_CHANNELS.GET_SETTINGS, () => {
    return settingsStore.getSettings();
  });

  ipcMain.handle(IPC_CHANNELS.UPDATE_SETTINGS, (_, settings: Partial<AppSettings>) => {
    settingsStore.updateSettings(settings);
  });
};
