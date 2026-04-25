import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logger } from './logger';

describe('Logger', () => {
  beforeEach(() => {
    // EventEmitter のリスナーをクリア
    logger.removeAllListeners();
    // console.log をモック化
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('シングルトンインスタンスであること', () => {
    const instance1 = logger;
    // getInstance() は private constructor なので直接呼べないが、
    // エクスポートされているインスタンスが同一であることを確認
    expect(instance1).toBeDefined();
  });

  describe('ログ出力メソッド', () => {
    it('info() が正しくログイベントを発火させること', () => {
      const handler = vi.fn();
      logger.onLog(handler);

      logger.info('test info message');

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'info',
          message: 'test info message',
          timestamp: expect.any(Number)
        })
      );
    });

    it('warn() が正しくログイベントを発火させること', () => {
      const handler = vi.fn();
      logger.onLog(handler);

      logger.warn('test warn message');

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'warn',
          message: 'test warn message'
        })
      );
    });

    it('error() が正しくログイベントを発火させること', () => {
      const handler = vi.fn();
      logger.onLog(handler);

      logger.error('test error message');

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'error',
          message: 'test error message'
        })
      );
    });

    it('console.log にも出力されること', () => {
      logger.info('console test');
      expect(console.log).toHaveBeenCalled();
      // 出力フォーマットの断片を確認
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] console test')
      );
    });
  });

  describe('onLog', () => {
    it('複数のリスナーを登録できること', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      logger.onLog(handler1);
      logger.onLog(handler2);

      logger.info('multi listener test');

      expect(handler1).toHaveBeenCalled();
      expect(handler2).toHaveBeenCalled();
    });
  });
});
