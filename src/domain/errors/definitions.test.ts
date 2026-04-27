import { describe, it, expect } from 'vitest';
import { appErrors, isAppError } from './definitions';
import { APP_ERROR_TYPES } from './constants';

describe('AppErrorDefinitions', () => {
  const options = { path: '/test.flac', detail: 'error' };

  describe('appErrors', () => {
    it('parseFailed が正しい AppError を生成すること', () => {
      const error = appErrors.parseFailed(options);
      expect(error.type).toBe('PARSE_FAILED');
      expect(error.options).toEqual(options);
    });

    it('writeFailed が正しい AppError を生成すること', () => {
      const error = appErrors.writeFailed(options);
      expect(error.type).toBe('WRITE_FAILED');
      expect(error.options).toEqual(options);
    });

    it('scanFailed が正しい AppError を生成すること', () => {
      const error = appErrors.scanFailed(options);
      expect(error.type).toBe('SCAN_FAILED');
      expect(error.options).toEqual(options);
    });

    it('pickImageFailed が正しい AppError を生成すること', () => {
      const error = appErrors.pickImageFailed(options);
      expect(error.type).toBe('PICK_IMAGE_FAILED');
      expect(error.options).toEqual(options);
    });

    it('全ての APP_ERROR_TYPES が網羅されていること (型レベルの確認を補完)', () => {
      APP_ERROR_TYPES.forEach((type) => {
        // type が "PARSE_FAILED" 形式なので、キャメルケースに変換してチェック
        const camelCaseType = type.toLowerCase().replace(/_([a-z])/g, (_, g) => g.toUpperCase());
        const key = camelCaseType.charAt(0).toLowerCase() + camelCaseType.slice(1);

        expect(appErrors).toHaveProperty(key);
      });
    });
  });

  describe('isAppError', () => {
    it('正しい AppError オブジェクトを true と判定すること', () => {
      const error = appErrors.parseFailed(options);
      expect(isAppError(error)).toBe(true);
    });

    it('一般のエラーオブジェクトを false と判定すること', () => {
      expect(isAppError(new Error())).toBe(false);
      expect(isAppError({})).toBe(false);
      expect(isAppError(null)).toBe(false);
    });
  });
});
