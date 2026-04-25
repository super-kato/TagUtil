import { describe, it, expect } from 'vitest';
import { computeMd5 } from './crypto';

describe('Crypto ユーティリティ', () => {
  describe('computeMd5', () => {
    it('Uint8Array データから正しい MD5 ハッシュ値を算出すること', () => {
      // "hello" の MD5: 5d41402abc4b2a76b9719d911017c592
      const data = new TextEncoder().encode('hello');
      const hash = computeMd5(data);
      expect(hash).toBe('5d41402abc4b2a76b9719d911017c592');
    });

    it('空のデータから正しい MD5 ハッシュ値を算出すること', () => {
      // 空データの MD5: d41d8cd98f00b204e9800998ecf8427e
      const data = new Uint8Array(0);
      const hash = computeMd5(data);
      expect(hash).toBe('d41d8cd98f00b204e9800998ecf8427e');
    });
  });
});
