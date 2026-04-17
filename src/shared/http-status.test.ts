import { describe, it, expect } from 'vitest';
import { HTTP_STATUS } from './http-status';

describe('HTTP_STATUS', () => {
  it('期待されるステータスコードが定義されていること', () => {
    expect(HTTP_STATUS.BAD_REQUEST).toBe(400);
    expect(HTTP_STATUS.NOT_FOUND).toBe(404);
    expect(HTTP_STATUS.INTERNAL_SERVER_ERROR).toBe(500);
  });

  it('定数が定義されていること', () => {
    expect(HTTP_STATUS).toHaveProperty('BAD_REQUEST');
    expect(HTTP_STATUS).toHaveProperty('NOT_FOUND');
    expect(HTTP_STATUS).toHaveProperty('INTERNAL_SERVER_ERROR');
  });
});
