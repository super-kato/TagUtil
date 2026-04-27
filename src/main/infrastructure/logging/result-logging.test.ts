import { failure, success } from '@domain/common/result';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('electron-log/main', () => ({
  default: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    initialize: vi.fn(),
    errorHandler: {
      startCatching: vi.fn()
    },
    transports: {
      file: {
        level: 'debug'
      }
    }
  }
}));

vi.mock('electron', () => ({
  app: {
    isPackaged: false
  }
}));

import * as formatter from '@domain/flac/app-error-formatter';
import { logger } from '@main/infrastructure/logging/logger';
import { withResultLogging } from './result-logging';

describe('result-logging', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // logger メソッドをスパイし、実際の出力を抑制
    vi.spyOn(logger, 'info').mockImplementation(() => {});
    vi.spyOn(logger, 'error').mockImplementation(() => {});
    // formatter をスパイ（パスが間違っていれば import 時点でエラーになる）
    vi.spyOn(formatter, 'formatAppError').mockImplementation((err) =>
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

    it('複数の補足メッセージを渡した場合、ロガーの引数として渡されること', async () => {
      const task = vi.fn().mockResolvedValue(success('data'));

      await withResultLogging('test-ctx', task, 'param1', 'param2');

      expect(logger.info).toHaveBeenCalledWith(
        { context: 'test-ctx', message: '' },
        'param1',
        'param2'
      );
    });

    it('補足メッセージに配列を渡した場合、ロガーの引数としてそのまま渡されること', async () => {
      const task = vi.fn().mockResolvedValue(success('data'));
      const paths = ['path/a', 'path/b'];

      await withResultLogging('test-ctx', task, paths);

      expect(logger.info).toHaveBeenCalledWith({ context: 'test-ctx', message: '' }, paths);
    });

    it('処理が失敗（Error型を返却）した場合、エラーログを出力すること', async () => {
      const error = { type: 'PARSE_FAILED', options: { path: 'file.flac' } };
      const task = vi.fn().mockResolvedValue(failure(error));
      vi.spyOn(logger, 'warn').mockImplementation(() => {});
      vi.mocked(formatter.formatAppError).mockReturnValue('Formatted Error Message');

      const result = await withResultLogging('test-ctx', task);

      expect(result.type).toBe('error');
      expect(logger.warn).toHaveBeenCalledWith({
        context: 'test-ctx',
        message: 'Formatted Error Message'
      });
      expect(formatter.formatAppError).toHaveBeenCalledWith(error);
    });

    it('例外が発生した場合、例外ログを出力して再スローすること', async () => {
      const error = new Error('Unexpected crash');
      const task = vi.fn().mockRejectedValue(error);
      vi.mocked(formatter.formatAppError).mockReturnValue('Formatted Exception Message');

      await expect(withResultLogging('test-ctx', task)).rejects.toThrow('Unexpected crash');

      expect(logger.error).toHaveBeenCalledWith({
        context: 'test-ctx',
        message: 'Formatted Exception Message'
      });
      expect(formatter.formatAppError).toHaveBeenCalledWith(error);
    });
  });
});
