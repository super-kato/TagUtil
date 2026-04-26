import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SettingsRepository } from './settings-repository';

const { mockStore } = vi.hoisted(() => {
  return {
    mockStore: {
      get: vi.fn(),
      set: vi.fn(),
      store: {
        theme: 'default'
      }
    }
  };
});

vi.mock('electron-store', () => {
  return {
    default: vi.fn().mockImplementation(function () {
      return mockStore;
    })
  };
});

describe('SettingsRepository', () => {
  let repository: SettingsRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new SettingsRepository();
  });

  it('初期値が設定されること', () => {
    mockStore.get.mockReturnValue(undefined);
    const settings = repository.settings;
    expect(settings.theme).toBe('default');
  });

  it('設定を保存できること', () => {
    const newSettings = { theme: 'light' as const };
    repository.updateSettings(newSettings);
    // updateSettingsは内部で各キーごとにsetを呼ぶ
    expect(mockStore.set).toHaveBeenCalledWith('theme', 'light');
  });

  it('保存された設定を取得できること', () => {
    // repository.settings は this.#store.store を返す
    mockStore.store = { theme: 'light' as const };
    const settings = repository.settings;
    expect(settings.theme).toBe('light');
  });
});
