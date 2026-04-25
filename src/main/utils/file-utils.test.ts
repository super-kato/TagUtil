import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isHiddenPath, isSupportedAudioFile, withAtomicWrite } from './file-utils';
import fs from 'node:fs/promises';

vi.mock('node:fs/promises', () => ({
  default: {
    copyFile: vi.fn().mockResolvedValue(undefined),
    rename: vi.fn().mockResolvedValue(undefined),
    unlink: vi.fn().mockResolvedValue(undefined),
    constants: {
      COPYFILE_FICLONE: 1
    }
  }
}));

describe('file-utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('isHiddenPath', () => {
    it('ドットで始まるファイル名を隠しファイルと判定すること', () => {
      expect(isHiddenPath('.hidden')).toBe(true);
      expect(isHiddenPath('/path/to/.hidden')).toBe(true);
    });

    it('ドットで始まらないファイル名は隠しファイルと判定しないこと', () => {
      expect(isHiddenPath('visible.txt')).toBe(false);
      expect(isHiddenPath('/path/to/visible.flac')).toBe(false);
    });
  });

  describe('isSupportedAudioFile', () => {
    it('.flac 拡張子をサポート対象として判定すること', () => {
      expect(isSupportedAudioFile('song.flac')).toBe(true);
      expect(isSupportedAudioFile('song.FLAC')).toBe(true);
    });

    it('.flac 以外の拡張子はサポート対象外として判定すること', () => {
      expect(isSupportedAudioFile('song.mp3')).toBe(false);
      expect(isSupportedAudioFile('song.wav')).toBe(false);
      expect(isSupportedAudioFile('song')).toBe(false);
    });
  });

  describe('withAtomicWrite', () => {
    const targetPath = '/path/to/file.flac';
    const tempPath = '/path/to/file.flac.tmp';

    it('正常系: コピー、タスク実行、リネームが行われること', async () => {
      const task = vi.fn().mockResolvedValue(undefined);

      await withAtomicWrite(targetPath, task);

      expect(fs.copyFile).toHaveBeenCalledWith(targetPath, tempPath, fs.constants.COPYFILE_FICLONE);
      expect(task).toHaveBeenCalledWith(tempPath);
      expect(fs.rename).toHaveBeenCalledWith(tempPath, targetPath);
      expect(fs.unlink).not.toHaveBeenCalled();
    });

    it('異常系: タスクが失敗した場合に一時ファイルが削除され、エラーが再スローされること', async () => {
      const error = new Error('Write failed');
      const task = vi.fn().mockRejectedValue(error);

      await expect(withAtomicWrite(targetPath, task)).rejects.toThrow(error);

      expect(fs.copyFile).toHaveBeenCalled();
      expect(task).toHaveBeenCalled();
      expect(fs.rename).not.toHaveBeenCalled();
      expect(fs.unlink).toHaveBeenCalledWith(tempPath);
    });

    it('異常系: クリーンアップ（unlink）が失敗した場合はそのエラーがスローされること', async () => {
      const error = new Error('Write failed');
      const task = vi.fn().mockRejectedValue(error);
      const unlinkError = new Error('Unlink failed');
      vi.mocked(fs.unlink).mockRejectedValue(unlinkError);

      // unlink が失敗するとそのエラーがスローされる
      await expect(withAtomicWrite(targetPath, task)).rejects.toThrow(unlinkError);
    });
  });
});
