/**
 * @vitest-environment jsdom
 */
import { success } from '@domain/common/result';
import { settingsRepository } from '@renderer/infrastructure/repositories/settings-repository';
import type { AppSettings } from '@shared/settings';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('SettingsStore', () => {
  const mockSettings: AppSettings = {
    renamePattern: '{trackNumber} - {title}',
    trackNumberPadding: 2,
    theme: 'dark',
    genres: ['Rock'],
    quickGenres: ['Rock']
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // 共通のデフォルト挙動を設定。個別のテストで必要なら上書き可能。
    vi.spyOn(settingsRepository, 'getSettings').mockResolvedValue(success(mockSettings));
    vi.spyOn(settingsRepository, 'updateSettings').mockResolvedValue(success(undefined));
  });

  it('初期状態は undefined であり、コンストラクタで refresh が呼ばれること', async () => {
    // モックが適用された後にクラスを読み込むことで、コンストラクタ内の呼び出しを補足する
    const { SettingsStore: settingsStoreClass } = await import('./settings-store.svelte');
    const store = new settingsStoreClass();

    expect(store.current).toBeUndefined();
    expect(settingsRepository.getSettings).toHaveBeenCalled();

    // Side effect の完了を待ってリークを防ぐ
    await vi.waitUntil(() => store.current !== undefined);
  });

  it('refresh 成功時に設定が更新されること', async () => {
    const { SettingsStore: settingsStoreClass } = await import('./settings-store.svelte');
    const store = new settingsStoreClass();

    // 状態が更新されるまで待機
    await vi.waitUntil(() => store.current !== undefined);

    expect(store.current).toEqual(mockSettings);
  });

  it('save で現在の設定が永続化され、refresh が呼ばれること', async () => {
    const { SettingsStore: settingsStoreClass } = await import('./settings-store.svelte');
    const store = new settingsStoreClass();
    await vi.waitUntil(() => store.current !== undefined);

    if (store.current) {
      store.current.theme = 'light';
    }
    // refresh() で取得される値を更新
    vi.mocked(settingsRepository.getSettings).mockResolvedValue({
      type: 'success',
      value: { ...mockSettings, theme: 'light' }
    });
    await store.save();

    // 全設定のスナップショットが渡されることを期待
    expect(settingsRepository.updateSettings).toHaveBeenCalledWith(
      expect.objectContaining({ theme: 'light' })
    );
    expect(settingsRepository.getSettings).toHaveBeenCalled();
    expect(store.current?.theme).toBe('light');
  });
});
