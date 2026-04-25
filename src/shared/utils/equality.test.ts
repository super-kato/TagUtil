import { describe, it, expect } from 'vitest';
import { isDeepEqual } from './equality';

describe('isDeepEqual', () => {
  it('プリミティブ値が一致する場合にtrueを返すこと', () => {
    expect(isDeepEqual(1, 1)).toBe(true);
    expect(isDeepEqual('a', 'a')).toBe(true);
    expect(isDeepEqual(true, true)).toBe(true);
    expect(isDeepEqual(null, null)).toBe(true);
    expect(isDeepEqual(undefined, undefined)).toBe(true);
  });

  it('プリミティブ値が一致しない場合にfalseを返すこと', () => {
    expect(isDeepEqual(1, 2)).toBe(false);
    expect(isDeepEqual('a', 'b')).toBe(false);
    expect(isDeepEqual(true, false)).toBe(false);
    expect(isDeepEqual(null, undefined)).toBe(false);
  });

  it('単純な配列が一致する場合にtrueを返すこと', () => {
    expect(isDeepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(isDeepEqual(['a', 'b'], ['a', 'b'])).toBe(true);
    expect(isDeepEqual([], [])).toBe(true);
  });

  it('入れ子になった配列が一致する場合にtrueを返すこと', () => {
    expect(isDeepEqual([1, [2, 3]], [1, [2, 3]])).toBe(true);
  });

  it('配列の順序が異なる場合にfalseを返すこと', () => {
    expect(isDeepEqual([1, 2], [2, 1])).toBe(false);
  });

  it('単純なオブジェクトが一致する場合にtrueを返すこと', () => {
    expect(isDeepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
  });

  it('オブジェクトのキーの順序が異なるが内容が同じ場合にtrueを返すこと', () => {
    expect(isDeepEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
  });

  it('入れ子になったオブジェクトが一致する場合にtrueを返すこと', () => {
    expect(isDeepEqual({ a: 1, b: { c: 3 } }, { a: 1, b: { c: 3 } })).toBe(true);
  });

  it('オブジェクトの内容が異なる場合にfalseを返すこと', () => {
    expect(isDeepEqual({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false);
    expect(isDeepEqual({ a: 1 }, { b: 1 })).toBe(false);
  });

  it('プロパティ数が異なる場合にfalseを返すこと', () => {
    expect(isDeepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
  });

  it('配列とオブジェクトを比較した場合にfalseを返すこと', () => {
    expect(isDeepEqual([1, 2], { key0: 1, key1: 2 })).toBe(false);
  });

  it('FLACメタデータのシミュレーション比較', () => {
    const meta1 = {
      title: 'Song',
      artist: ['Artist 1', 'Artist 2'],
      picture: { format: 'image/jpeg', hash: 'abc' }
    };
    const meta2 = {
      artist: ['Artist 1', 'Artist 2'],
      title: 'Song',
      picture: { format: 'image/jpeg', hash: 'abc' }
    };
    expect(isDeepEqual(meta1, meta2)).toBe(true);
  });
});
