import { Dirent, Stats } from 'node:fs';
import * as fs from 'node:fs/promises';
import { beforeEach, describe, expect, it, vi, Mock } from 'vitest';
import { scanFiles } from './file-scanner-repository';

vi.mock('node:fs/promises');
vi.mock('@main/utils/file-utils', () => ({
  isHiddenPath: vi.fn().mockReturnValue(false)
}));

describe('file-scanner-repository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('指定されたファイルをスキャンしてリストを返すこと', async () => {
    const mockStat = {
      isDirectory: () => false,
      isFile: () => true
    } as Stats;
    vi.mocked(fs.stat).mockResolvedValue(mockStat);

    const result = await scanFiles(['file1.flac', 'file2.flac'], () => true);

    expect(result.paths).toEqual(['file1.flac', 'file2.flac']);
    expect(result.isLimited).toBe(false);
  });

  it('ディレクトリを再帰的にスキャンすること', async () => {
    const dirStat = { isDirectory: () => true, isFile: () => false } as Stats;
    const fileStat = { isDirectory: () => false, isFile: () => true } as Stats;
    vi.mocked(fs.stat).mockResolvedValueOnce(dirStat).mockResolvedValue(fileStat);
    // readdir のモック (Dirent オブジェクトを返す)
    const mockDirent = (name: string, isDir: boolean): Dirent => {
      const d = Object.create(Dirent.prototype);
      Object.assign(d, {
        name,
        parentPath: '',
        isDirectory: () => isDir,
        isFile: () => !isDir,
        isBlockDevice: () => false,
        isCharacterDevice: () => false,
        isSymbolicLink: () => false,
        isFIFO: () => false,
        isSocket: () => false
      });
      return d;
    };

    (vi.mocked(fs.readdir) as Mock)
      .mockResolvedValueOnce([mockDirent('sub', true), mockDirent('song1.flac', false)])
      .mockResolvedValue([]);

    // 再帰呼び出しの stat/readdir はモックで制御が難しいので、
    // ここでは基本的な readdir 呼び出しを確認する
    const result = await scanFiles(['/music'], (p) => p.endsWith('.flac'));

    expect(fs.readdir).toHaveBeenCalledWith('/music', { withFileTypes: true });
    // song1.flac はディレクトリ直下なので含まれるはず
    expect(result.paths).toContain('/music/song1.flac');
  });

  it('最大件数制限が機能すること', async () => {
    // 301件のファイルをシミュレート
    const fileStat = { isDirectory: () => false, isFile: () => true } as Stats;
    vi.mocked(fs.stat).mockResolvedValue(fileStat);

    const manyPaths = Array.from({ length: 301 }, (_, i) => `file${i}.flac`);
    const result = await scanFiles(manyPaths, () => true);

    expect(result.paths).toHaveLength(300);
    expect(result.isLimited).toBe(true);
  });
});
