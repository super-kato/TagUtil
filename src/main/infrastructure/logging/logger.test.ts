import { describe, it, expect, vi, beforeEach } from 'vitest';
import log from 'electron-log/main';
import { logger } from './logger';
import { settingsRepository } from '@main/infrastructure/repositories/settings/settings-repository';

describe('Logger', () => {
  beforeEach(() => {
    // ログレベルを DEBUG に設定して通常テストを行う
    settingsRepository.updateSettings({ logLevel: 'DEBUG' });
    // EventEmitter のリスナーをクリア
    logger.removeAllListeners();
    // モックをリセット
    vi.clearAllMocks();
  });

  describe('ログ出力メソッド', () => {
    it('debug() が正しくログイベントを発火させること', () => {
      const handler = vi.fn();
      logger.onLog(handler);

      logger.debug({ context: 'test', message: 'test debug message' });

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'DEBUG',
          context: 'test',
          message: 'test debug message'
        })
      );
    });

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

    it('INFO 設定時は DEBUG ログが転送されないこと', () => {
      settingsRepository.updateSettings({ logLevel: 'INFO' });

      const handler = vi.fn();
      logger.onLog(handler);

      logger.debug({ context: 'test', message: 'hidden debug' });
      expect(handler).not.toHaveBeenCalled();

      logger.info({ context: 'test', message: 'visible info' });
      expect(handler).toHaveBeenCalled();
    });
  });
});
