import { beforeEach, describe, expect, it, vi } from 'vitest';
import Store from 'electron-store';
import { SettingsRepository } from './settings-repository';

describe('SettingsRepository', () => {
  let repository: SettingsRepository;

  beforeEach(() => {
    vi.clearAllMocks();

    // グローバルモックのプロトタイプメソッドをスパイ
    vi.spyOn(Store.prototype, 'set');

    repository = new SettingsRepository();
  });

  it('初期値が設定されること', () => {
    const settings = repository.settings;
    expect(settings.theme).toBe('system');
    // DEFAULT_SETTINGS の初期値を検証
    expect(settings.genres).toContain('Pop');
  });

  it('設定を保存できること', () => {
    const newSettings = { theme: 'light' as const };
    repository.updateSettings(newSettings);
    expect(Store.prototype.set).toHaveBeenCalledWith('theme', 'light');
  });

  it('保存された設定を取得できること', () => {
    // モックの内部状態を直接操作するか、再度 new する際の defaults を通じて検証
    // ここでは単純に値をセットして取得できるか確認
    repository.updateSettings({ genres: ['Rock'] });
    expect(repository.settings.genres).toContain('Rock');
  });
});
