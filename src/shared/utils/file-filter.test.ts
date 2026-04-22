import { describe, it, expect } from 'vitest';
import { hasExtension } from './file-filter';

describe('file-filter', () => {
  describe('hasExtension', () => {
    it('拡張子が一致する場合に true を返すこと', () => {
      expect(hasExtension('test.flac', ['.flac'])).toBe(true);
      expect(hasExtension('test.FLAC', ['.flac'])).toBe(true);
      expect(hasExtension('test.flac', ['.FLAC'])).toBe(true);
    });

    it('複数の拡張子のいずれかに一致する場合に true を返すこと', () => {
      expect(hasExtension('test.jpg', ['.jpg', '.png'])).toBe(true);
      expect(hasExtension('test.png', ['.jpg', '.png'])).toBe(true);
    });

    it('拡張子が一致しない場合に false を返すこと', () => {
      expect(hasExtension('test.txt', ['.flac'])).toBe(false);
      expect(hasExtension('testflac', ['.flac'])).toBe(false);
    });

    it('大文字小文字を区別せずに判定すること', () => {
      expect(hasExtension('TEST.JPG', ['.jpg'])).toBe(true);
      expect(hasExtension('test.jpg', ['.JPG'])).toBe(true);
    });
  });
});
