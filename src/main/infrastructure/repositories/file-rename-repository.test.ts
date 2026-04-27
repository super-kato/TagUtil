import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renameFileExclusive } from './file-rename-repository';
import * as fs from 'node:fs/promises';
import { Stats } from 'node:fs';

vi.mock('node:fs/promises');

describe('file-rename-repository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('同一パスの場合は何もしないこと', async () => {
    await renameFileExclusive('path/a.flac', 'path/a.flac');
    expect(fs.rename).not.toHaveBeenCalled();
    expect(fs.link).not.toHaveBeenCalled();
  });

  it('大文字小文字のみの変更の場合は直接 rename を呼ぶこと', async () => {
    await renameFileExclusive('path/Song.flac', 'path/song.flac');
    expect(fs.rename).toHaveBeenCalledWith('path/Song.flac', 'path/song.flac');
    expect(fs.link).not.toHaveBeenCalled();
  });

  describe('通常のリネーム（移動）', () => {
    it('リンクが成功した場合はリンク作成後に元ファイルを削除すること', async () => {
      vi.mocked(fs.link).mockResolvedValue(undefined);
      vi.mocked(fs.unlink).mockResolvedValue(undefined);

      await renameFileExclusive('old.flac', 'new.flac');

      expect(fs.link).toHaveBeenCalledWith('old.flac', 'new.flac');
      expect(fs.unlink).toHaveBeenCalledWith('old.flac');
    });

    it('リンク作成時に EEXIST が発生した場合はエラーを投げること', async () => {
      const error = new Error('already exists') as Error & { code: string };
      error.code = 'EEXIST';
      vi.mocked(fs.link).mockRejectedValue(error);

      await expect(renameFileExclusive('old.flac', 'new.flac')).rejects.toThrow(error);
    });

    it('リンクがシステム制限等で失敗した場合、stat チェック後に rename すること', async () => {
      // リンク失敗 (EPERM など)
      const linkError = new Error('not supported') as Error & { code: string };
      linkError.code = 'EPERM';
      vi.mocked(fs.link).mockRejectedValue(linkError);

      // stat 失敗 (ENOENT: 移動先が存在しない)
      const statError = new Error('not found') as Error & { code: string };
      statError.code = 'ENOENT';
      vi.mocked(fs.stat).mockRejectedValue(statError);

      await renameFileExclusive('old.flac', 'new.flac');

      expect(fs.stat).toHaveBeenCalledWith('new.flac');
      expect(fs.rename).toHaveBeenCalledWith('old.flac', 'new.flac');
    });

    it('フォールバック時に移動先が既に存在していればエラーを投げること', async () => {
      vi.mocked(fs.link).mockRejectedValue(new Error('link failed'));
      vi.mocked(fs.stat).mockResolvedValue({} as Stats); // 存在している

      await expect(renameFileExclusive('old.flac', 'new.flac')).rejects.toThrow(
        'File already exists'
      );
      expect(fs.rename).not.toHaveBeenCalled();
    });
  });
});
