import { dialog } from 'electron';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { pickImageFile, selectDirectory } from './dialog';

vi.mock('electron', () => ({
  dialog: {
    showOpenDialog: vi.fn()
  }
}));

describe('platform/dialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('selectDirectory', () => {
    it('ディレクトリが選択された場合にそのパスを返すこと', async () => {
      vi.mocked(dialog.showOpenDialog).mockResolvedValue({
        canceled: false,
        filePaths: ['/selected/dir']
      });

      const result = await selectDirectory();

      expect(dialog.showOpenDialog).toHaveBeenCalledWith({
        properties: ['openDirectory']
      });
      expect(result).toBe('/selected/dir');
    });

    it('キャンセルされた場合に null を返すこと', async () => {
      vi.mocked(dialog.showOpenDialog).mockResolvedValue({
        canceled: true,
        filePaths: []
      });

      const result = await selectDirectory();
      expect(result).toBeNull();
    });
  });

  describe('pickImageFile', () => {
    it('画像ファイルが選択された場合にそのパスを返すこと', async () => {
      vi.mocked(dialog.showOpenDialog).mockResolvedValue({
        canceled: false,
        filePaths: ['/path/to/image.jpg']
      });

      const result = await pickImageFile();

      expect(dialog.showOpenDialog).toHaveBeenCalledWith(
        expect.objectContaining({
          properties: ['openFile'],
          filters: expect.arrayContaining([expect.objectContaining({ name: 'Images' })])
        })
      );
      expect(result).toBe('/path/to/image.jpg');
    });
  });
});
