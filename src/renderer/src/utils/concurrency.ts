import pLimit from 'p-limit';

/**
 * 標準的な同時実行制限（20件）
 */
const DEFAULT_CONCURRENCY = 20;

/**
 * 非同期処理の同時実行数を制限して一括実行します。
 * Promise.all をラップし、実行順序を維持しながら同時実行数を制御します。
 * 同時実行数は DEFAULT_CONCURRENCY (20) に制限されています。
 *
 * @param tasks 実行する非同期タスクの配列
 * @returns 各タスクの結果配列
 */
export const pooledAll = async <T>(tasks: (() => Promise<T>)[]): Promise<T[]> => {
  const limit = pLimit(DEFAULT_CONCURRENCY);
  return Promise.all(tasks.map((task) => limit(task)));
};
