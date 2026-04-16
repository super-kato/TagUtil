import { describe, it, expect } from 'vitest';
import { success, failure } from './result';

describe('Result ユーティリティ', () => {
  describe('success', () => {
    it('成功時の値を持つ「success」タイプの結果を生成すること', () => {
      const val = { data: 'test' };
      const res = success(val);
      expect(res.type).toBe('success');
      expect(res.value).toBe(val);
    });

    it('プリミティブ値を正しくラップすること', () => {
      expect(success(10).value).toBe(10);
      expect(success('ok').value).toBe('ok');
      expect(success(true).value).toBe(true);
    });
  });

  describe('failure', () => {
    it('エラー情報を持つ「error」タイプの結果を生成すること', () => {
      const err = new Error('fail');
      const res = failure(err);
      expect(res.type).toBe('error');
      expect(res.error).toBe(err);
    });

    it('エラーメッセージ文字列を正しくラップすること', () => {
      const errMsg = 'something went wrong';
      const res = failure(errMsg);
      expect(res.type).toBe('error');
      expect(res.error).toBe(errMsg);
    });
  });
});
