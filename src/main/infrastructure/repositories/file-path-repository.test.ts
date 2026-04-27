import { app } from 'electron';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { getAppResourcePath, resolveNewPath } from './file-path-repository';

vi.mock('electron', () => ({
  app: {
    getAppPath: vi.fn().mockReturnValue('/app/root')
  }
}));

describe('file-path-repository', () => {
  describe('getAppResourcePath', () => {
    it('アプリのルートパスを基準とした絶対パスを返すこと', () => {
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
