import { deepEqual } from 'fast-equals';

/**
 * 2つの値が深く等しいかどうかを判定します。
 * 将来的なライブラリの変更に備え、このラッパー層を介して比較を行います。
 */
export const isDeepEqual = (a: unknown, b: unknown): boolean => {
  return deepEqual(a, b);
};
