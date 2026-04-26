/**
 * @vitest-environment jsdom
 */
import { success } from '@domain/common/result';
import { settingsRepository } from '@renderer/infrastructure/repositories/settings-repository';
import type { AppSettings } from '@shared/settings';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SettingsStore } from './settings-store.svelte';

// settingsRepository のメソッドをスパイ/モック化
describe('SettingsStore', () => {
  const mockSettings: AppSettings = {
    renamePattern: '{trackNumber} - {title}',
    trackNumberPadding: 2,
    theme: 'default'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // window.api の最小限のモック
    Object.defineProperty(window, 'api', {
      value: {
        getSettings: vi.fn().mockResolvedValue(success(mockSettings)),
        updateSettings: vi.fn().mockResolvedValue(success(undefined))
      },
      configurable: true
    });
  });

  it('初期状態は undefined であり、コンストラクタで refresh が呼ばれること', async () => {
    const spy = vi
      .spyOn(settingsRepository, 'getSettings')
      .mockResolvedValue(success(mockSettings));
    const store = new SettingsStore();

    expect(store.current).toBeUndefined();
    expect(spy).toHaveBeenCalled();

    // Side effect の完了を待ってリークを防ぐ
    await vi.waitUntil(() => store.current !== undefined);
  });

  it('refresh 成功時に設定が更新されること', async () => {
    vi.spyOn(settingsRepository, 'getSettings').mockResolvedValue(success(mockSettings));
    const store = new SettingsStore();

    // 状態が更新されるまで待機
    await vi.waitUntil(() => store.current !== undefined);

    expect(store.current).toEqual(mockSettings);
  });
});
