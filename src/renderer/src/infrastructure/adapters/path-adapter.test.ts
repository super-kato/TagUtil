import { describe, it, expect } from 'vitest';
import { getDirectoryName, joinPath } from './path-adapter';

describe('path-adapter', () => {
  describe('getDirectoryName', () => {
    it('Unix形式のパスからディレクトリ名を抽出できること', () => {
      expect(getDirectoryName('/path/to/file.txt')).toBe('/path/to');
    });

    it('Windows形式のパスからディレクトリ名を抽出できること', () => {
      expect(getDirectoryName('C:\\path\\to\\file.txt')).toBe('C:\\path\\to');
    });

    it('ルートディレクトリ（Unix）のディレクトリ名を正しく返せること', () => {
      expect(getDirectoryName('/file.txt')).toBe('/');
    });

    it('ルートディレクトリ（Windows）のディレクトリ名を正しく返せること', () => {
      expect(getDirectoryName('C:\\file.txt')).toBe('C:\\');
    });

    it('セパレータが含まれない場合に "." を返すこと', () => {
      expect(getDirectoryName('file.txt')).toBe('.');
    });
  });

  describe('joinPath', () => {
    it('Unix形式のパスを結合できること', () => {
      expect(joinPath('/path/to', 'file.txt')).toBe('/path/to/file.txt');
    });

    it('Windows形式のパスを結合できること', () => {
      expect(joinPath('C:\\path\\to', 'file.txt')).toBe('C:\\path\\to\\file.txt');
    });

    it('末尾にセパレータがあるディレクトリでも正しく結合できること', () => {
      expect(joinPath('/path/to/', 'file.txt')).toBe('/path/to/file.txt');
      expect(joinPath('C:\\path\\to\\', 'file.txt')).toBe('C:\\path\\to\\file.txt');
    });
  });
});
