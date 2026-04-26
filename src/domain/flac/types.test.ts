import { describe, it, expect } from 'vitest';
import { appErrors } from './errors';
import { APP_ERROR_TYPES } from './constants';

describe('flac types', () => {
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
});
