import { describe, it, expect } from 'vitest';
import { tagErrors, TAG_ERROR_TYPES } from './types';

describe('flac types (tagErrors)', () => {
  const options = { path: '/path/to/music.flac', detail: 'Something happened' };

  it('fileNotFound が正しい TagError を生成すること', () => {
    const error = tagErrors.fileNotFound(options);
    expect(error.type).toBe('FILE_NOT_FOUND');
    expect(error.options).toEqual(options);
  });

  it('permissionDenied が正しい TagError を生成すること', () => {
    const error = tagErrors.permissionDenied(options);
    expect(error.type).toBe('PERMISSION_DENIED');
    expect(error.options).toEqual(options);
  });

  it('parseFailed が正しい TagError を生成すること', () => {
    const error = tagErrors.parseFailed(options);
    expect(error.type).toBe('PARSE_FAILED');
    expect(error.options).toEqual(options);
  });

  it('writeFailed が正しい TagError を生成すること', () => {
    const error = tagErrors.writeFailed(options);
    expect(error.type).toBe('WRITE_FAILED');
    expect(error.options).toEqual(options);
  });

  it('scanFailed が正しい TagError を生成すること', () => {
    const error = tagErrors.scanFailed(options);
    expect(error.type).toBe('SCAN_FAILED');
    expect(error.options).toEqual(options);
  });

  it('pickImageFailed が正しい TagError を生成すること', () => {
    const error = tagErrors.pickImageFailed(options);
    expect(error.type).toBe('PICK_IMAGE_FAILED');
    expect(error.options).toEqual(options);
  });

  it('全ての TAG_ERROR_TYPES が網羅されていること (型レベルの確認を補完)', () => {
    TAG_ERROR_TYPES.forEach((type) => {
      // type が "FILE_NOT_FOUND" 形式なので、キャメルケースに変換してチェック
      const camelCaseType = type.toLowerCase().replace(/_([a-z])/g, (_, g) => g.toUpperCase());
      expect(Object.keys(tagErrors)).toContain(camelCaseType);
    });
  });
});
