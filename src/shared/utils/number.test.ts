import { describe, it, expect } from 'vitest';
import { clamp } from './number';

describe('number utils (clamp)', () => {
  it('範囲内の数値はそのままであること', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('最小値を下回る場合は最小値を返すこと', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it('最大値を上回る場合は最大値を返すこと', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('最小値そのものが渡された場合は最小値を返すこと', () => {
    expect(clamp(0, 0, 10)).toBe(0);
  });

  it('最大値そのものが渡された場合は最大値を返すこと', () => {
    expect(clamp(10, 0, 10)).toBe(10);
  });
});
