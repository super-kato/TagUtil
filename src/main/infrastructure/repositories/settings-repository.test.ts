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
    vi.spyOn(Store.prototype, 'store', 'get').mockReturnValue({
      renamePattern: '{track} - {title}',
      trackNumberPadding: 2,
      theme: 'dark',
      genres: [],
      quickGenres: []
    });

    repository = new SettingsRepository();
  });

  it('初期値が設定されること', () => {
    vi.spyOn(Store.prototype, 'get').mockReturnValue(undefined);
    const settings = repository.settings;
    expect(settings.theme).toBe('dark');
    expect(settings.genres).toEqual([]);
  });

  it('設定を保存できること', () => {
    const newSettings = { theme: 'light' as const };
    repository.updateSettings(newSettings);
    expect(Store.prototype.set).toHaveBeenCalledWith('theme', 'light');
  });

  it('保存された設定を取得できること', () => {
    const saved = {
      renamePattern: '{track} - {title}',
      trackNumberPadding: 2,
      theme: 'light' as const,
      genres: ['Rock'],
      quickGenres: ['Rock']
    };
    vi.spyOn(Store.prototype, 'store', 'get').mockReturnValue(saved);
    const settings = repository.settings;
    expect(settings.theme).toBe('light');
    expect(settings.genres).toContain('Rock');
  });
});
