import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '@shared/ipc';
import { settingsRepository } from '@main/infrastructure/repositories/settings/settings-repository';
import type { AppSettings } from '@shared/settings';
import { success } from '@domain/common/result';
import { withResultLogging } from '@main/infrastructure/logging/result-logging';
import { logger } from '@main/infrastructure/logging/logger';

/**
 * 設定に関連する IPC ハンドラを登録します。
 */
export const registerSettingsHandlers = (): void => {
  ipcMain.handle(IPC_CHANNELS.GET_CONFIG, async () => {
    return withResultLogging(IPC_CHANNELS.GET_CONFIG, async () =>
      success(settingsRepository.settings)
    );
  });

  ipcMain.handle(IPC_CHANNELS.UPDATE_CONFIG, async (_, settings: Partial<AppSettings>) => {
    return withResultLogging(IPC_CHANNELS.UPDATE_CONFIG, async () => {
      settingsRepository.updateSettings(settings);
      logger.updateLogLevel();
      return success(undefined);
    });
  });
};
