import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initAutoUpdater, checkForUpdates } from './update';
import { autoUpdater, type UpdateCheckResult } from 'electron-updater';
import { dialog } from 'electron';

vi.mock('electron-updater', () => ({
  autoUpdater: {
    checkForUpdatesAndNotify: vi.fn(),
    checkForUpdates: vi.fn(),
    currentVersion: { version: '1.4.2' },
    allowPrerelease: false
  }
}));

describe('platform/update', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initAutoUpdater', () => {
    it('autoUpdater を初期化し、アップデートを確認すること', () => {
      initAutoUpdater();
      expect(autoUpdater.allowPrerelease).toBe(true);
      expect(autoUpdater.checkForUpdatesAndNotify).toHaveBeenCalled();
    });
  });

  describe('checkForUpdates', () => {
    it('アップデートがない場合に通知ダイアログを表示すること', async () => {
      vi.mocked(autoUpdater.checkForUpdates).mockResolvedValue({
        updateInfo: { version: '1.4.2' }
      } as UpdateCheckResult);

      await checkForUpdates();

      expect(dialog.showMessageBox).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('latest version')
        })
      );
    });

    it('アップデートがある場合に通知とダウンロードを開始すること', async () => {
      vi.mocked(autoUpdater.checkForUpdates).mockResolvedValue({
        updateInfo: { version: '1.5.0' }
      } as UpdateCheckResult);

      await checkForUpdates();

      expect(autoUpdater.checkForUpdatesAndNotify).toHaveBeenCalled();
    });

    it('エラー発生時にエラーダイアログを表示すること', async () => {
      vi.mocked(autoUpdater.checkForUpdates).mockRejectedValue(new Error('Network error'));

      await checkForUpdates();

      expect(dialog.showErrorBox).toHaveBeenCalledWith('Update Error', expect.any(String));
    });
  });
});
