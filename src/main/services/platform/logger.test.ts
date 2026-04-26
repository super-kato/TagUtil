import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logger } from './logger';

describe('Logger', () => {
  beforeEach(() => {
    // EventEmitter のリスナーをクリア
    logger.removeAllListeners();
    // console.log をモック化
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  describe('ログ出力メソッド', () => {
    it('info() が正しくログイベントを発火させること', () => {
      const handler = vi.fn();
      logger.onLog(handler);

      logger.info({ context: 'test', message: 'test info message' });

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          level: 'INFO',
          context: 'test',
          message: 'test info message',
          timestamp: expect.any(Number)
        })
      );
    });

    it('warn() が正しくログイベントを発火させること', () => {
      const handler = vi.fn();
      logger.onLog(handler);

      logger.warn({ context: 'test', message: 'test warn message' });

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          level: 'WARN',
          context: 'test',
          message: 'test warn message'
        })
      );
    });

    it('error() が正しくログイベントを発火させること', () => {
      const handler = vi.fn();
      logger.onLog(handler);

      logger.error({ context: 'test', message: 'test error message' });

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          level: 'ERROR',
          context: 'test',
          message: 'test error message'
        })
      );
    });

    it('console.log にも出力されること', () => {
      logger.info({ context: 'console', message: 'console test' });
      expect(console.log).toHaveBeenCalled();
      // 出力フォーマットの断片を確認
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('[INFO] [console] console test'));
    });
  });

  describe('onLog', () => {
    it('複数のリスナーを登録できること', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      logger.onLog(handler1);
      logger.onLog(handler2);

      logger.info({ context: 'multi', message: 'multi listener test' });

      expect(handler1).toHaveBeenCalled();
      expect(handler2).toHaveBeenCalled();
    });
  });
});
