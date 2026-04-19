import { describe, it, expect } from 'vitest';
import { sanitize } from './filename';

describe('filename utils (sanitize)', () => {
  it('ファイル名に使用できない文字がアンダースコアに置換されること', () => {
    const input = 'a\\b/c:d*e?f"g<h>i|j';
    const expected = 'a_b_c_d_e_f_g_h_i_j';
    expect(sanitize(input)).toBe(expected);
  });

  it('前後の空白が削除されること', () => {
    const input = '  filename.txt  ';
    const expected = 'filename.txt';
    expect(sanitize(input)).toBe(expected);
  });

  it('空白のみのファイル名が空文字列になること', () => {
    const input = '   ';
    const expected = '';
    expect(sanitize(input)).toBe(expected);
  });

  it('不適切な文字を含まないファイル名は変更されないこと', () => {
    const input = 'my-song_01.flac';
    const expected = 'my-song_01.flac';
    expect(sanitize(input)).toBe(expected);
  });
});
