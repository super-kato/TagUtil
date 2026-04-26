import { describe, it, expect } from 'vitest';
import { pooledAll } from './concurrency';

describe('concurrency utility', () => {
  describe('pooledAll', () => {
    it('全てのタスクが実行され、結果の順序が維持されること', async () => {
      const tasks = [
        async () => 'A',
        async () => 'B',
        async () => 'C',
        async () => 'D'
      ];

      const results = await pooledAll(tasks);

      expect(results).toStrictEqual(['A', 'B', 'C', 'D']);
    });

    it('同時実行数が制限されていること', async () => {
      const concurrencyLimit = 20;
      const totalTasks = 50;
      let activeCount = 0;
      let maxActiveCount = 0;

      const tasks = Array.from({ length: totalTasks }, (_, i) => async () => {
        activeCount++;
        maxActiveCount = Math.max(maxActiveCount, activeCount);

        // 実行時間を少し持たせて重なりを作る
        await new Promise((resolve) => setTimeout(resolve, 10));

        activeCount--;
        return i;
      });

      const results = await pooledAll(tasks);

      expect(results).toHaveLength(totalTasks);
      expect(maxActiveCount).toBeLessThanOrEqual(concurrencyLimit);
      // 実際にはリミットいっぱい（20）まで並行に走るはず
      expect(maxActiveCount).toBe(concurrencyLimit);
    });

    it('エラーが発生したタスクがあっても他のタスクの結果を収集すること (Promise.allと同様の挙動)', async () => {
      const tasks = [
        async () => 'A',
        async () => {
          throw new Error('Failure');
        },
        async () => 'C'
      ];

      // Promise.all と同様、一つでも例外（Reject）が発生すれば全体が例外となる
      await expect(pooledAll(tasks)).rejects.toThrow('Failure');
    });
  });
});
