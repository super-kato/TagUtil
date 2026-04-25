import { describe, it, expect, vi, beforeEach, type MockInstance } from 'vitest';
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
    (window.api.onLogMessage as unknown as MockInstance).mockReturnValue(unsubscribeMock);

    const result = logRepository.subscribe(callback);

    expect(window.api.onLogMessage).toHaveBeenCalledWith(callback);
    expect(result).toBe(unsubscribeMock);
  });
});
