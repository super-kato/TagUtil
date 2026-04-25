import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createLogMessage } from './log';

describe('Log ユーティリティ', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));
  });

  describe('createLogMessage', () => {
    it('正しい構造のログメッセージを生成すること', () => {
      const message = 'Test message';
      const log = createLogMessage('INFO', message);

      expect(log.id).toBeDefined();
      expect(typeof log.id).toBe('string');
      expect(log.level).toBe('INFO');
      expect(log.message).toBe(message);
      expect(log.timestamp).toBe(Date.now());
    });

    it('指定されたログレベルが正しく反映されること', () => {
      const errorLog = createLogMessage('ERROR', 'Error');
      expect(errorLog.level).toBe('ERROR');

      const warnLog = createLogMessage('WARN', 'Warning');
      expect(warnLog.level).toBe('WARN');
    });
  });
});
