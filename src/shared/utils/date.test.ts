import { describe, it, expect } from 'vitest';
import { formatLogTime } from './date';

describe('日付ユーティリティ', () => {
  describe('formatLogTime', () => {
    it('ミリ秒単位を含む日本時間の時刻形式 (HH:mm:ss.SSS) を返すこと', () => {
      // 2026-04-25 10:20:30.456 JST (UTC+9)
      // UTC では 2026-04-25 01:20:30.456
      const timestamp = new Date('2026-04-25T01:20:30.456Z').getTime();
      const formatted = formatLogTime(timestamp);

      // 01:20:30.456Z (UTC) + 9h = 10:20:30.456 JST
      expect(formatted).toBe('10:20:30.456');
    });

    it('0埋めが正しく行われること', () => {
      // 2026-04-25 01:02:03.004 JST
      // UTC では 2026-04-24 16:02:03.004
      const timestamp = new Date('2026-04-24T16:02:03.004Z').getTime();
      const formatted = formatLogTime(timestamp);

      expect(formatted).toBe('01:02:03.004');
    });

    it('24時間表記であること', () => {
      // 2026-04-25 23:59:59.999 JST
      // UTC では 2026-04-25 14:59:59.999
      const timestamp = new Date('2026-04-25T14:59:59.999Z').getTime();
      const formatted = formatLogTime(timestamp);

      expect(formatted).toBe('23:59:59.999');
    });
  });
});
