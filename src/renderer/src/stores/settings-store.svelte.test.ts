/**
 * @vitest-environment jsdom
 */
import { success } from '@domain/common/result';
import { settingsRepository } from '@renderer/infrastructure/repositories/settings-repository';
import type { AppSettings } from '@shared/settings';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MAX_QUICK_GENRES, SettingsStore } from './settings-store.svelte';

const mockDefaultSettings: AppSettings = {
  renamePattern: '{trackNumber} - {title}',
  trackNumberPadding: 2,
  theme: 'system',
  logLevel: 'INFO',
  genres: ['Rock'],
  quickGenres: ['Rock']
};

vi.mock('@renderer/infrastructure/repositories/settings-repository', () => ({
  settingsRepository: {
    getSettings: vi.fn().mockResolvedValue({
      type: 'success',
      value: {
        renamePattern: '{trackNumber} - {title}',
        trackNumberPadding: 2,
        theme: 'system',
        logLevel: 'INFO',
        genres: ['Rock'],
        quickGenres: ['Rock']
      }
    }),
    updateSettings: vi.fn().mockResolvedValue({ type: 'success', value: undefined })
  }
}));

describe('SettingsStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(settingsRepository, 'getSettings').mockResolvedValue(success(mockDefaultSettings));
    vi.spyOn(settingsRepository, 'updateSettings').mockResolvedValue(success(undefined));
  });

  it('初期状態は undefined であり、refresh() を呼ぶことで設定が読み込まれること', async () => {
    const store = new SettingsStore();

    expect(store.current).toBeUndefined();
    await store.refresh();
    expect(settingsRepository.getSettings).toHaveBeenCalled();
    expect(store.current).toEqual(mockDefaultSettings);
  });

  it('refresh 成功時に設定が更新されること', async () => {
    const store = new SettingsStore();
    await store.refresh();

    expect(store.current).toEqual(mockDefaultSettings);
  });

  it('save で現在の設定が永続化され、refresh が呼ばれること', async () => {
    const store = new SettingsStore();
    await store.refresh();

    store.update('theme', 'light');

    // refresh() で取得される値を更新
    vi.mocked(settingsRepository.getSettings).mockResolvedValue({
      type: 'success',
      value: { ...mockDefaultSettings, theme: 'light' }
    });
    await store.save();

    // 全設定のスナップショットが渡されることを期待
    expect(settingsRepository.updateSettings).toHaveBeenCalledWith(
      expect.objectContaining({ theme: 'light' })
    );
    expect(settingsRepository.getSettings).toHaveBeenCalled();
    expect(store.current?.theme).toBe('light');
  });

  describe('データ操作メソッド', () => {
    it('update で単純なプロパティを更新できること', async () => {
      const store = new SettingsStore();
      await store.refresh();

      store.update('renamePattern', '{artist} - {title}');
      store.update('trackNumberPadding', 3);

      expect(store.current?.renamePattern).toBe('{artist} - {title}');
      expect(store.current?.trackNumberPadding).toBe(3);
    });

    it('addGenre でジャンルを追加できること', async () => {
      const store = new SettingsStore();
      await store.refresh();

      store.addGenre('Jazz');
      expect(store.current?.genres).toContain('Jazz');
    });

    it('removeGenre でジャンルを削除し、クイックジャンルからも同期削除されること', async () => {
      const store = new SettingsStore();
      await store.refresh();

      // 初期状態で Rock が両方にある
      store.removeGenre('Rock');
      expect(store.current?.genres).not.toContain('Rock');
      expect(store.current?.quickGenres).not.toContain('Rock');
    });

    it('toggleQuickGenre で選択状態を切り替え、最大数制限が守られること', async () => {
      const store = new SettingsStore();
      await store.refresh();

      // 初期値 Rock (1つ)
      store.addGenre('G1');
      store.addGenre('G2');
      store.addGenre('G3');
      store.addGenre('G4');

      store.toggleQuickGenre('G1');
      store.toggleQuickGenre('G2');
      store.toggleQuickGenre('G3');
      // この時点で Rock, G1, G2, G3 の4つ（上限）
      expect(store.current?.quickGenres.length).toBe(MAX_QUICK_GENRES);

      store.toggleQuickGenre('G4'); // 追加されないはず
      expect(store.current?.quickGenres.length).toBe(MAX_QUICK_GENRES);
      expect(store.current?.quickGenres).not.toContain('G4');

      store.toggleQuickGenre('Rock'); // 削除
      expect(store.current?.quickGenres).not.toContain('Rock');
      expect(store.current?.quickGenres.length).toBe(3);

      store.toggleQuickGenre('G4'); // 空きができたので追加されるはず
      expect(store.current?.quickGenres).toContain('G4');
      expect(store.current?.quickGenres.length).toBe(4);
    });
  });

  describe('異常系・境界系', () => {
    it('refresh 失敗時に current が更新されないこと', async () => {
      vi.spyOn(settingsRepository, 'getSettings').mockResolvedValue({
        type: 'error',
        error: { type: 'SCAN_FAILED', options: {} }
      });
      const store = new SettingsStore();

      // しばらく待っても undefined のままであること
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(store.current).toBeUndefined();
    });

    it('save 失敗時に refresh が呼ばれないこと', async () => {
      const store = new SettingsStore();
      await store.refresh();

      vi.spyOn(settingsRepository, 'updateSettings').mockResolvedValue({
        type: 'error',
        error: { type: 'WRITE_FAILED', options: {} }
      });
      vi.mocked(settingsRepository.getSettings).mockClear();

      await store.save();
      expect(settingsRepository.getSettings).not.toHaveBeenCalled();
    });

    it('current が undefined の時、各メソッドが何もしないこと（ガード節の通過）', async () => {
      vi.spyOn(settingsRepository, 'getSettings').mockResolvedValue({
        type: 'error',
        error: { type: 'SCAN_FAILED', options: {} }
      });
      const store = new SettingsStore();
      // current は undefined

      // 各メソッドを呼んでも例外が発生しないことを確認
      expect(() => {
        store.save();
        store.update('theme', 'light');
        store.update('renamePattern', 'test');
        store.addGenre('test');
        store.removeGenre('test');
        store.toggleQuickGenre('test');
      }).not.toThrow();
    });
  });
});
