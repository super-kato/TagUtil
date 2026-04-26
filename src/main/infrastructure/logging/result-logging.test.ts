import { failure, success } from '@domain/common/result';
import { logger } from '@services/platform/logger';
import * as formatter from '@domain/flac/tag-error-formatter';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { withResultLogging } from './result-logging';

describe('result-logging', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // logger メソッドをスパイし、実際の出力を抑制
    vi.spyOn(logger, 'info').mockImplementation(() => {});
    vi.spyOn(logger, 'error').mockImplementation(() => {});
    // formatter をスパイ（パスが間違っていれば import 時点でエラーになる）
    vi.spyOn(formatter, 'formatTagError').mockImplementation((err) =>
      err instanceof Error ? err.message : String(err)
    );
  });

  describe('withResultLogging', () => {
    it('処理が成功した場合、成功ログを出力すること', async () => {
      const task = vi.fn().mockResolvedValue(success('data'));

      const result = await withResultLogging('test-ctx', task);

      expect(result.type).toBe('success');
      expect(logger.info).toHaveBeenCalledWith({ context: 'test-ctx', message: '' });
    });

    it('複数の補足メッセージを渡した場合、カンマ区切りでログに含まれること', async () => {
      const task = vi.fn().mockResolvedValue(success('data'));

      await withResultLogging('test-ctx', task, 'param1', 'param2');

      expect(logger.info).toHaveBeenCalledWith({ context: 'test-ctx', message: 'param1, param2' });
    });

    it('補足メッセージに配列を渡した場合、カンマ区切りでログに含まれること', async () => {
      const task = vi.fn().mockResolvedValue(success('data'));
      const paths = ['path/a', 'path/b'];

      await withResultLogging('test-ctx', task, paths);

      // Array.prototype.join() により、配列の要素がカンマ区切りで出力される
      expect(logger.info).toHaveBeenCalledWith({ context: 'test-ctx', message: 'path/a,path/b' });
    });

    it('処理が失敗（Error型を返却）した場合、エラーログを出力すること', async () => {
      const error = { type: 'PARSE_FAILED', options: { path: 'file.flac' } };
      const task = vi.fn().mockResolvedValue(failure(error));
      vi.spyOn(logger, 'warn').mockImplementation(() => {});
      vi.mocked(formatter.formatTagError).mockReturnValue('Formatted Error Message');

      const result = await withResultLogging('test-ctx', task);

      expect(result.type).toBe('error');
      expect(logger.warn).toHaveBeenCalledWith({
        context: 'test-ctx',
        message: 'Formatted Error Message'
      });
      expect(formatter.formatTagError).toHaveBeenCalledWith(error);
    });

    it('例外が発生した場合、例外ログを出力して再スローすること', async () => {
      const error = new Error('Unexpected crash');
      const task = vi.fn().mockRejectedValue(error);
      vi.mocked(formatter.formatTagError).mockReturnValue('Formatted Exception Message');

      await expect(withResultLogging('test-ctx', task)).rejects.toThrow('Unexpected crash');

      expect(logger.error).toHaveBeenCalledWith({
        context: 'test-ctx',
        message: 'Formatted Exception Message'
      });
      expect(formatter.formatTagError).toHaveBeenCalledWith(error);
    });

    it('引数(params)がある状態で例外が発生した場合、引数情報を含めてログ出力すること', async () => {
      const error = new Error('Crash with params');
      const task = vi.fn().mockRejectedValue(error);
      vi.mocked(formatter.formatTagError).mockReturnValue('Error Detail');

      await expect(withResultLogging('test-ctx', task, 'p1', 'p2')).rejects.toThrow(
        'Crash with params'
      );

      expect(logger.error).toHaveBeenCalledWith({
        context: 'test-ctx',
        message: 'p1, p2: Error Detail'
      });
    });
  });
});
