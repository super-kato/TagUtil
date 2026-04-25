import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logRepository } from './log-repository';

describe('LogRepository', () => {
  beforeEach(() => {
    vi.stubGlobal('window', {
      api: {
        onLogMessage: vi.fn()
      }
    });
  });

  it('subscribe が window.api.onLogMessage を呼び出すこと', () => {
    const callback = vi.fn();
    const unsubscribeMock = vi.fn();
    (window.api.onLogMessage as any).mockReturnValue(unsubscribeMock);

    const result = logRepository.subscribe(callback);

    expect(window.api.onLogMessage).toHaveBeenCalledWith(callback);
    expect(result).toBe(unsubscribeMock);
  });
});
