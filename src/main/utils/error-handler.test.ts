import { describe, it, expect, vi, afterEach } from 'vitest';
import { hasErrorCode, toTagResultFailure } from './error-handler';
import { tagErrors } from '@domain/flac/types';

describe('error-handler', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('hasErrorCode', () => {
    it('指定されたコードを持つオブジェクトの場合に true を返すこと', () => {
      const error = { code: 'ENOENT', message: 'File not found' };
      expect(hasErrorCode(error, 'ENOENT')).toBe(true);
    });

    it('コードが一致しない場合に false を返すこと', () => {
      const error = { code: 'EACCES', message: 'Permission denied' };
      expect(hasErrorCode(error, 'ENOENT')).toBe(false);
    });

    it('code プロパティを持たないオブジェクトの場合に false を返すこと', () => {
      const error = { message: 'Some error' };
      expect(hasErrorCode(error, 'ENOENT')).toBe(false);
    });

    it('null や非オブジェクトの場合に false を返すこと', () => {
      expect(hasErrorCode(null, 'ENOENT')).toBe(false);
      expect(hasErrorCode('error', 'ENOENT')).toBe(false);
      expect(hasErrorCode(123, 'ENOENT')).toBe(false);
    });
  });

  describe('toTagResultFailure', () => {
    const path = '/test/path.flac';
    const factory = tagErrors.fileNotFound;

    it('Error オブジェクトを TagResult の Failure（失敗）に正しく変換できること', () => {
      const error = new Error('Original error message');

      const result = toTagResultFailure(error, factory, { path });

      expect(result.type).toBe('error');
      if (result.type === 'error') {
        expect(result.error.type).toBe('FILE_NOT_FOUND');
        expect(result.error.options.path).toBe(path);
        expect(result.error.options.detail).toBe('Original error message');
      }
    });

    it('文字列のエラーメッセージを TagResult の Failure に正しく変換できること', () => {
      const error = 'Something went wrong';

      const result = toTagResultFailure(error, factory, { path });

      expect(result.type).toBe('error');
      if (result.type === 'error') {
        expect(result.error.options.detail).toBe('Something went wrong');
      }
    });
  });
});
