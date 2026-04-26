import { describe, it, expect } from 'vitest';
import { formatAppError } from './app-error-formatter';
import type { AppError } from './errors';

describe('エラーフォーマッター', () => {
  describe('formatAppError', () => {
    it('AppError オブジェクトを適切に翻訳すること', () => {
      const error: AppError = {
        type: 'FILE_NOT_FOUND',
        options: { path: 'test.flac' }
      };
      expect(formatAppError(error)).toBe('File not found');
    });

    it('AppError に詳細情報がある場合、それを含めること', () => {
      const error: AppError = {
        type: 'WRITE_FAILED',
        options: { path: 'test.flac', detail: 'Disk full' }
      };
      expect(formatAppError(error)).toBe('Failed to write metadata: Disk full');
    });

    it('標準の Error オブジェクトからメッセージを取得すること', () => {
      const error = new Error('Generic error');
      expect(formatAppError(error)).toBe('Generic error');
    });

    it('文字列やその他の値をそのまま文字列化すること', () => {
      expect(formatAppError('Something bad')).toBe('Something bad');
      expect(formatAppError(404)).toBe('404');
    });

    it('未知のエラータイプの場合、フォールバックメッセージを表示すること', () => {
      const unknownError = {
        type: 'UNKNOWN_TYPE',
        options: { path: 'test.flac' }
      };
      // 型定義上はあり得ないが、実行時の安全性のためのテスト
      expect(formatAppError(unknownError)).toBe('Unknown error');
    });
  });
});
