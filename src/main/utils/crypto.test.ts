import { describe, it, expect } from 'vitest';
import { computeMd5, generateId } from './crypto';

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

  describe('generateId', () => {
    it('UUID 形式の文字列を生成すること', () => {
      const id = generateId();
      // UUID v4 の形式チェック (8-4-4-4-12)
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(id).toMatch(uuidRegex);
    });

    it('呼び出すたびに異なる ID を生成すること', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });
  });
});
