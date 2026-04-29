import { app } from 'electron';
import { join } from 'node:path';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { getAppResourcePath, resolveNewPath } from './file-path-repository';

describe('file-path-repository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAppResourcePath', () => {
    it('アプリのルートパスを基準とした絶対パスを返すこと', () => {
      vi.mocked(app.getAppPath).mockReturnValue('/app/root');
      const result = getAppResourcePath('resources', 'icon.png');
      expect(app.getAppPath).toHaveBeenCalled();
      expect(result).toBe(join('/app/root', 'resources', 'icon.png'));
    });
  });

  describe('resolveNewPath', () => {
    it('現在のパスのディレクトリと拡張子を維持して、新しいファイル名のパスを生成すること', () => {
      const currentPath = '/music/album/01 - song.flac';
      const newBaseName = '01 - new title';

      const result = resolveNewPath(currentPath, newBaseName);

      expect(result).toBe(join('/music/album', '01 - new title.flac'));
    });
  });
});
