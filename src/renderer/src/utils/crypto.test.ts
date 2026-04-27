import { describe, it, expect } from 'vitest';
import { computeSha256 } from './crypto';

// Web Crypto API のグローバルモック
if (!globalThis.crypto) {
  Object.defineProperty(globalThis, 'crypto', {
    value: {},
    writable: true
  });
}

describe('crypto', () => {
  describe('computeSha256', () => {
    it('Uint8Array データの SHA-256 ハッシュを正しく計算すること', async () => {
      // "hello" の SHA-256 ハッシュ値
      const expectedHash = '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824';
      const data = new TextEncoder().encode('hello');

      // 実際のブラウザ API が利用可能な場合はそれを使用、
      // そうでない場合（Node.js テスト環境など）はモックするか Node.js の crypto を利用
      // Vitest の node 環境では globalThis.crypto.subtle が存在する場合がある
      if (!globalThis.crypto.subtle) {
        const nodeCrypto = await import('node:crypto');
        Object.defineProperty(globalThis.crypto, 'subtle', {
          value: {
            digest: async (_algorithm: string, data: ArrayBuffer) => {
              return nodeCrypto.createHash('sha256').update(new Uint8Array(data)).digest().buffer;
            }
          },
          writable: true
        });
      }

      const hash = await computeSha256(data);
      expect(hash).toBe(expectedHash);
    });

    it('空データのハッシュを正しく計算すること', async () => {
      const emptyData = new Uint8Array(0);
      const expectedEmptyHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

      const hash = await computeSha256(emptyData);
      expect(hash).toBe(expectedEmptyHash);
    });
  });
});
