import { describe, it, expect, vi, beforeEach } from 'vitest';
import log from 'electron-log/main';
import { logger } from './logger';

vi.mock('electron-log/main', () => ({
  default: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    initialize: vi.fn()
  }
}));

describe('Logger', () => {
  beforeEach(() => {
    // EventEmitter のリスナーをクリア
    logger.removeAllListeners();
    // モックをリセット
    vi.clearAllMocks();
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

    it('electron-log にも出力されること', () => {
      logger.info({ context: 'electron', message: 'electron test' });
      expect(log.info).toHaveBeenCalledWith('[electron] electron test');
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
