import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '@shared/ipc';
import { settingsRepository } from '@main/infrastructure/repositories/settings-repository';
import type { AppSettings } from '@shared/settings';
import { success } from '@domain/common/result';
import { withResultLogging } from '@main/infrastructure/logging/result-logging';

/**
 * 設定に関連する IPC ハンドラを登録します。
 */
export const registerSettingsHandlers = (): void => {
  ipcMain.handle(IPC_CHANNELS.GET_SETTINGS, async () => {
    return withResultLogging(IPC_CHANNELS.GET_SETTINGS, async () =>
      success(settingsRepository.settings)
    );
  });

  ipcMain.handle(IPC_CHANNELS.UPDATE_SETTINGS, async (_, settings: Partial<AppSettings>) => {
    return withResultLogging(IPC_CHANNELS.UPDATE_SETTINGS, async () => {
      settingsRepository.updateSettings(settings);
      return success(undefined);
    });
  });
};
