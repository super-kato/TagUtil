import { describe, it, expect, vi, beforeEach } from 'vitest';
import { settingsRepository } from './settings-repository';
import { success } from '@domain/common/result';
import type { AppSettings } from '@shared/settings';

describe('settings-repository', () => {
  beforeEach(() => {
    vi.stubGlobal('window', {
      api: {
        getSettings: vi.fn(),
        updateSettings: vi.fn()
      }
    });
  });

  describe('getSettings', () => {
    it('window.api.getSettings を呼び出し、結果を返却すること', async () => {
      const mockSettings: AppSettings = {
        renamePattern: '{title}',
        trackNumberPadding: 3,
        theme: 'dark',
        genres: [],
        quickGenres: []
      };
      const mockResult = success(mockSettings);
      vi.mocked(window.api.getSettings).mockResolvedValue(mockResult);

      const result = await settingsRepository.getSettings();

      expect(result).toStrictEqual(mockResult);
      expect(window.api.getSettings).toHaveBeenCalled();
    });
  });

  describe('updateSettings', () => {
    it('window.api.updateSettings を正しい引数で呼び出すこと', async () => {
      const update: Partial<AppSettings> = { trackNumberPadding: 4 };
      const mockResult = success(undefined);
      vi.mocked(window.api.updateSettings).mockResolvedValue(mockResult);

      const result = await settingsRepository.updateSettings(update);

      expect(result).toStrictEqual(mockResult);
      expect(window.api.updateSettings).toHaveBeenCalledWith(update);
    });
  });
});
