import { describe, it, expect } from 'vitest';
import { getMimeTypeFromPath } from './mime';

describe('MIME ユーティリティ', () => {
  describe('getMimeTypeFromPath', () => {
    it('JPEG拡張子に対して image/jpeg を返すこと', () => {
      expect(getMimeTypeFromPath('image.jpg')).toBe('image/jpeg');
      expect(getMimeTypeFromPath('IMAGE.JPEG')).toBe('image/jpeg');
    });

    it('PNG拡張子に対して image/png を返すこと', () => {
      expect(getMimeTypeFromPath('icon.png')).toBe('image/png');
    });

    it('WebP拡張子に対して image/webp を返すこと', () => {
      expect(getMimeTypeFromPath('photo.webp')).toBe('image/webp');
    });

    it('未知の拡張子に対して application/octet-stream を返すこと', () => {
      expect(getMimeTypeFromPath('data.txt')).toBe('application/octet-stream');
      expect(getMimeTypeFromPath('no-extension')).toBe('application/octet-stream');
    });

    it('パス全体の文字列から正しく判定できること', () => {
      expect(getMimeTypeFromPath('/path/to/music/cover.jpg')).toBe('image/jpeg');
    });
  });
});
