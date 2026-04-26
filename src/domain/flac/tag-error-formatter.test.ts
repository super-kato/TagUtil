import { describe, it, expect } from 'vitest';
import { formatTagError } from './tag-error-formatter';
import type { TagError } from './errors';

describe('エラーフォーマッター', () => {
  describe('formatTagError', () => {
    it('TagError オブジェクトを適切に翻訳すること', () => {
      const error: TagError = {
        type: 'FILE_NOT_FOUND',
        options: { path: 'test.flac' }
      };
      expect(formatTagError(error)).toBe('File not found');
    });

    it('TagError に詳細情報がある場合、それを含めること', () => {
      const error: TagError = {
        type: 'WRITE_FAILED',
        options: { path: 'test.flac', detail: 'Disk full' }
      };
      expect(formatTagError(error)).toBe('Failed to write metadata: Disk full');
    });

    it('標準の Error オブジェクトからメッセージを取得すること', () => {
      const error = new Error('Generic error');
      expect(formatTagError(error)).toBe('Generic error');
    });

    it('文字列やその他の値をそのまま文字列化すること', () => {
      expect(formatTagError('Something bad')).toBe('Something bad');
      expect(formatTagError(404)).toBe('404');
    });

    it('未知のエラータイプの場合、フォールバックメッセージを表示すること', () => {
      const unknownError = {
        type: 'UNKNOWN_TYPE',
        options: { path: 'test.flac' }
      };
      // 型定義上はあり得ないが、実行時の安全性のためのテスト
      expect(formatTagError(unknownError)).toBe('Unknown error');
    });
  });
});
