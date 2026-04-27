import { describe, it, expect } from 'vitest';
import { formatAppError } from './formatter';
import { appErrors } from './definitions';

describe('AppErrorFormatter', () => {
  it('AppError を人間が読めるメッセージにフォーマットすること', () => {
    const error = appErrors.parseFailed({ detail: 'Native parse error' });
    const message = formatAppError(error);
    expect(message).toBe('Failed to parse metadata: Native parse error');
  });

  it('詳細情報がない場合、ラベルのみを返すこと', () => {
    const error = appErrors.scanFailed({});
    const message = formatAppError(error);
    expect(message).toBe('Failed to scan directory');
  });

  it('通常の Error オブジェクトのメッセージを返すこと', () => {
    const error = new Error('Standard error');
    const message = formatAppError(error);
    expect(message).toBe('Standard error');
  });

  it('不明な型のエラーを文字列化して返すこと', () => {
    const message = formatAppError('Some string error');
    expect(message).toBe('Some string error');
  });
});
