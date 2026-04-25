import { describe, it, expect, vi, beforeEach } from 'vitest';
import { withResultLogging } from './result-logging';
import { logger } from '@services/platform/logger';
import { formatTagError } from '@shared/utils/tag-error-formatter';
import { success, failure } from '@domain/common/result';

// モック化
vi.mock('@services/platform/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn()
  }
}));

vi.mock('@shared/utils/tag-error-formatter', () => ({
  formatTagError: vi.fn((err) => (err instanceof Error ? err.message : String(err)))
}));

describe('result-logging', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('withResultLogging', () => {
    it('処理が成功した場合、成功ログを出力すること', async () => {
      const task = vi.fn().mockResolvedValue(success('data'));

      const result = await withResultLogging('test-ctx', task);

      expect(result.type).toBe('success');
      expect(logger.info).toHaveBeenCalledWith('[test-ctx] - succeeded');
    });

    it('補足メッセージがある場合、ログに含まれること', async () => {
      const task = vi.fn().mockResolvedValue(success('data'));

      await withResultLogging('test-ctx', task, 'my-message');

      expect(logger.info).toHaveBeenCalledWith('[test-ctx] my-message - succeeded');
    });

    it('処理が失敗（Error型を返却）した場合、エラーログを出力すること', async () => {
      const error = { type: 'PARSE_FAILED', options: { path: 'file.flac' } };
      const task = vi.fn().mockResolvedValue(failure(error));
      vi.mocked(formatTagError).mockReturnValue('Formatted Error Message');

      const result = await withResultLogging('test-ctx', task);

      expect(result.type).toBe('error');
      expect(logger.error).toHaveBeenCalledWith('[test-ctx] - failed: Formatted Error Message');
      expect(formatTagError).toHaveBeenCalledWith(error);
    });

    it('例外が発生した場合、例外ログを出力して再スローすること', async () => {
      const error = new Error('Unexpected crash');
      const task = vi.fn().mockRejectedValue(error);
      vi.mocked(formatTagError).mockReturnValue('Formatted Exception Message');

      await expect(withResultLogging('test-ctx', task)).rejects.toThrow('Unexpected crash');

      expect(logger.error).toHaveBeenCalledWith('[test-ctx] - exception: Formatted Exception Message');
      expect(formatTagError).toHaveBeenCalledWith(error);
    });
  });
});
