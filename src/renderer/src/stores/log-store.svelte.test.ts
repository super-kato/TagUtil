import { describe, it, expect, beforeEach } from 'vitest';
import { logStore } from './log-store.svelte';

describe('LogStore', () => {
  beforeEach(() => {
    // 各テスト前にログをクリア（現状クリアメソッドがないため、モジュールステートに依存することに注意）
    // 本来はインスタンスを毎回生成できるのが理想だが、シングルトンとしての挙動をテストする。
    while (logStore.logs.length > 0) {
      logStore.logs.shift();
    }
  });

  it('初期状態は空であること', () => {
    expect(logStore.logs).toEqual([]);
    expect(logStore.latestLog).toBeUndefined();
  });

  it('addLog でログを追加できること', () => {
    const log = {
      id: '1',
      level: 'INFO' as const,
      context: 'Test',
      message: 'Test message',
      timestamp: Date.now()
    };
    logStore.addLog(log);

    expect(logStore.logs).toHaveLength(1);
    expect(logStore.logs[0]).toEqual(log);
    expect(logStore.latestLog).toEqual(log);
  });

  it('addError でエラーログを追加できること', () => {
    logStore.addError({ context: 'Test', message: 'Error message' });
    expect(logStore.latestLog?.level).toBe('ERROR');
    expect(logStore.latestLog?.message).toBe('Error message');
  });

  it('addWarn で警告ログを追加できること', () => {
    logStore.addWarn({ context: 'Test', message: 'Warn message' });
    expect(logStore.latestLog?.level).toBe('WARN');
    expect(logStore.latestLog?.message).toBe('Warn message');
  });

  it('最大件数（100件）を超えたら古いものから削除されること', () => {
    const MAX = 100;
    for (let i = 0; i < MAX + 10; i++) {
      logStore.addLog({
        id: `${i}`,
        level: 'INFO',
        context: 'Test',
        message: `Message ${i}`,
        timestamp: Date.now()
      });
    }

    expect(logStore.logs).toHaveLength(MAX);
    // 最初の10件が削除され、11番目（index 10）が先頭になっているはず
    expect(logStore.logs[0].id).toBe('10');
    // 最後に追加したものが latestLog になっているはず
    expect(logStore.latestLog?.id).toBe('109');
  });
});
