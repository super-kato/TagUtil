import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SettingsRepository } from './settings-repository';
import Store from 'electron-store';

vi.mock('electron-store');

describe('SettingsRepository', () => {
  let repository: SettingsRepository;
  let mockStore: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockStore = {
      get: vi.fn(),
      set: vi.fn(),
      store: {
        theme: 'default'
      }
    };
    vi.mocked(Store).mockImplementation(() => mockStore);
    repository = new SettingsRepository();
  });

  it('初期値が設定されること', () => {
    mockStore.get.mockReturnValue(undefined);
    const settings = repository.getSettings();
    expect(settings.theme).toBe('default');
  });

  it('設定を保存できること', () => {
    const newSettings = { theme: 'dark' as const };
    repository.saveSettings(newSettings);
    expect(mockStore.set).toHaveBeenCalledWith('settings', newSettings);
  });

  it('保存された設定を取得できること', () => {
    const savedSettings = { theme: 'dark' as const };
    mockStore.get.mockReturnValue(savedSettings);
    const settings = repository.getSettings();
    expect(settings).toEqual(savedSettings);
  });
});
