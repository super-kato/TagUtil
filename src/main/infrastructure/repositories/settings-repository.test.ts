import { DEFAULT_SETTINGS } from './settings-repository';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SettingsRepository } from './settings-repository';

const { mockStore } = vi.hoisted(() => ({
  mockStore: {
    store: {
      renamePattern: '{trackNumber} - {title}',
      trackNumberPadding: 2
    },
    set: vi.fn(),
    get: vi.fn()
  }
}));

vi.mock('electron-store', () => {
  return {
    default: class {
      store = mockStore.store;
      set = mockStore.set;
      get = mockStore.get;
    }
  };
});

describe('SettingsRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('初期値が設定されること', () => {
    const repo = new SettingsRepository();
    expect(repo.settings).toEqual(DEFAULT_SETTINGS);
  });

  it('updateSettings でストアが更新されること', () => {
    const repo = new SettingsRepository();
    const update = { trackNumberPadding: 5 };

    repo.updateSettings(update);

    expect(mockStore.set).toHaveBeenCalledWith('trackNumberPadding', 5);
  });

  it('undefined の値は更新されないこと', () => {
    const repo = new SettingsRepository();
    const update = { trackNumberPadding: undefined };

    repo.updateSettings(update);

    expect(mockStore.set).not.toHaveBeenCalled();
  });
});
