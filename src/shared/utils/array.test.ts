import { describe, it, expect } from 'vitest';
import { arraysEqual } from './array';

describe('arraysEqual', () => {
  it('内容（順序含む）が完全に一致する配列の場合、trueを返すこと', () => {
    expect(arraysEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(arraysEqual(['a', 'b'], ['a', 'b'])).toBe(true);
    expect(arraysEqual([], [])).toBe(true);
  });

  it('配列の長さが異なる場合、falseを返すこと', () => {
    expect(arraysEqual([1, 2], [1, 2, 3])).toBe(false);
  });

  it('配列の内容が異なる場合、falseを返すこと', () => {
    expect(arraysEqual([1, 2, 3], [1, 2, 4])).toBe(false);
  });

  it('配列以外の値で、値が完全に一致する場合、trueを返すこと', () => {
    expect(arraysEqual('a', 'a')).toBe(true);
    expect(arraysEqual(1, 1)).toBe(true);
    expect(arraysEqual(null, null)).toBe(true);
    expect(arraysEqual(undefined, undefined)).toBe(true);
  });

  it('片方が配列でない場合、falseを返すこと', () => {
    expect(arraysEqual([1, 2], 'not-array')).toBe(false);
    expect(arraysEqual('not-array', [1, 2])).toBe(false);
  });

  it('配列以外の値で、値が異なる場合、falseを返すこと', () => {
    expect(arraysEqual('a', 'b')).toBe(false);
    expect(arraysEqual(1, 2)).toBe(false);
    expect(arraysEqual(null, undefined)).toBe(false);
  });
});
