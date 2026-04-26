import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { SettingsStore } from './settings-store.svelte';
import { settingsRepository } from '@renderer/infrastructure/repositories/settings-repository';
import { success } from '@domain/common/result';
import { DEFAULT_SETTINGS, type AppSettings } from '@shared/settings';

// settingsRepository のメソッドをスパイ/モック化
describe('SettingsStore', () => {
  beforeAll(() => {
    vi.stubGlobal('window', {
      api: {
        getSettings: vi.fn(),
        updateSettings: vi.fn()
      }
    });
  });

  beforeEach(() => {
    vi.clearAllMocks();
    // デフォルトで成功を返すようにスパイを設定
    vi.spyOn(settingsRepository, 'getSettings').mockResolvedValue(success(DEFAULT_SETTINGS));
    vi.spyOn(settingsRepository, 'updateSettings').mockResolvedValue(success(undefined));
  });

  it('初期化時に設定を読み込むこと', async () => {
    const mockSettings: AppSettings = {
      renamePattern: '{trackNumber} {title}',
      trackNumberPadding: 4
    };
    vi.spyOn(settingsRepository, 'getSettings').mockResolvedValue(success(mockSettings));

    const store = new SettingsStore();

    // constructor で refresh が呼ばれる
    // refresh は async なので、確実に完了を待つために手動で呼ぶ
    await store.refresh();

    expect(store.current).toEqual(mockSettings);
    expect(settingsRepository.getSettings).toHaveBeenCalled();
  });

  it('refresh で最新の設定を同期できること', async () => {
    const store = new SettingsStore();
    const updatedSettings: AppSettings = {
      renamePattern: 'new-pattern',
      trackNumberPadding: 5
    };
    vi.spyOn(settingsRepository, 'getSettings').mockResolvedValue(success(updatedSettings));

    await store.refresh();

    expect(store.current).toEqual(updatedSettings);
  });

  it('update で設定を更新し、完了後に再同期すること', async () => {
    const initialSettings: AppSettings = DEFAULT_SETTINGS;
    const updatedSettings: AppSettings = { ...DEFAULT_SETTINGS, trackNumberPadding: 9 };

    vi.spyOn(settingsRepository, 'getSettings').mockResolvedValueOnce(success(initialSettings));
    const store = new SettingsStore();

    vi.spyOn(settingsRepository, 'updateSettings').mockResolvedValue(success(undefined));
    vi.spyOn(settingsRepository, 'getSettings').mockResolvedValueOnce(success(updatedSettings));

    await store.update({ trackNumberPadding: 9 });

    expect(settingsRepository.updateSettings).toHaveBeenCalledWith({ trackNumberPadding: 9 });
    // update 成功後に refresh が呼ばれる
    expect(settingsRepository.getSettings).toHaveBeenCalledTimes(2);
    expect(store.current.trackNumberPadding).toBe(9);
  });

  it('update が失敗した場合は再同期しないこと', async () => {
    vi.spyOn(settingsRepository, 'getSettings').mockResolvedValue(success(DEFAULT_SETTINGS));
    const store = new SettingsStore();
    vi.clearAllMocks();

    vi.spyOn(settingsRepository, 'updateSettings').mockResolvedValue({
      type: 'error',
      error: { type: 'WRITE_FAILED', options: { path: 'config' } }
    });

    await store.update({ trackNumberPadding: 9 });

    expect(settingsRepository.updateSettings).toHaveBeenCalled();
    expect(settingsRepository.getSettings).not.toHaveBeenCalled();
    expect(store.current).toEqual(DEFAULT_SETTINGS);
  });
});
