import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createLogMessage } from './log';

describe('Log ユーティリティ (Domain)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));
  });

  describe('createLogMessage', () => {
    it('正しい構造のログメッセージを生成すること', () => {
      const message = 'Test message';
      const log = createLogMessage({ level: 'INFO', context: 'TestContext', message });

      expect(log.id).toBeDefined();
      expect(typeof log.id).toBe('string');
      expect(log.level).toBe('INFO');
      expect(log.context).toBe('TestContext');
      expect(log.message).toBe(message);
      expect(log.timestamp).toBe(Date.now());
    });
  });
});
