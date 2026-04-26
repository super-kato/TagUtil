import { beforeEach, describe, expect, it, vi } from 'vitest';
import Store from 'electron-store';
import { SettingsRepository } from './settings-repository';

vi.mock('electron-store');

describe('SettingsRepository', () => {
  let repository: SettingsRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    // プロトタイプメソッドをスパイ
    vi.spyOn(Store.prototype, 'get').mockReturnValue(undefined);
    vi.spyOn(Store.prototype, 'set').mockImplementation(() => ({}));
    // store プロパティ（ゲッター）をスパイ
    vi.spyOn(Store.prototype, 'store', 'get').mockReturnValue({ theme: 'default' });

    repository = new SettingsRepository();
  });

  it('初期値が設定されること', () => {
    // get('theme') が undefined を返すとき、DEFAULT_SETTINGS が使われる
    vi.spyOn(Store.prototype, 'get').mockReturnValue(undefined);
    const settings = repository.settings;
    expect(settings.theme).toBe('default');
  });

  it('設定を保存できること', () => {
    const newSettings = { theme: 'light' as const };
    repository.updateSettings(newSettings);
    expect(Store.prototype.set).toHaveBeenCalledWith('theme', 'light');
  });

  it('保存された設定を取得できること', () => {
    // repository.settings は this.#store.store を返す
    vi.spyOn(Store.prototype, 'store', 'get').mockReturnValue({ theme: 'light' as const });
    const settings = repository.settings;
    expect(settings.theme).toBe('light');
  });
});
