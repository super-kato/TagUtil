import { describe, it, expect, beforeEach } from 'vitest';
import { uiState } from './ui-state.svelte';
import { failure } from '@domain/common/result';
import type { TagError } from '@domain/flac/types';

describe('UiState', () => {
  beforeEach(() => {
    uiState.reset();
  });

  it('初期状態が正しいこと', () => {
    expect(uiState.error).toBeNull();
    expect(uiState.isLoading).toBe(false);
    expect(uiState.isScanLimited).toBe(false);
  });

  it('startLoading で isLoading が true になること', () => {
    uiState.startLoading();
    expect(uiState.isLoading).toBe(true);
  });

  it('stopLoading で isLoading が false になること', () => {
    uiState.startLoading();
    uiState.stopLoading();
    expect(uiState.isLoading).toBe(false);
  });

  it('setError でエラーメッセージが設定されること', () => {
    const error: TagError = {
      type: 'PARSE_FAILED',
      options: { path: 'test.flac', detail: 'custom message' }
    };
    uiState.setError(failure(error));
    expect(uiState.error).toBe('Failed to parse file: custom message');
  });

  it('clearError でエラーメッセージが消去されること', () => {
    const error: TagError = {
      type: 'PARSE_FAILED',
      options: { path: 'test.flac', detail: 'test error' }
    };
    uiState.setError(failure(error));
    uiState.clearError();
    expect(uiState.error).toBeNull();
  });

  it('setScanLimited で isScanLimited が更新されること', () => {
    uiState.setScanLimited(true);
    expect(uiState.isScanLimited).toBe(true);
    uiState.setScanLimited(false);
    expect(uiState.isScanLimited).toBe(false);
  });

  it('reset で全ての状態が初期化されること', () => {
    uiState.startLoading();
    uiState.setError(failure({ type: 'PARSE_FAILED', options: { path: '', detail: 'error' } }));
    uiState.setScanLimited(true);

    uiState.reset();

    expect(uiState.error).toBeNull();
    expect(uiState.isLoading).toBe(false);
    expect(uiState.isScanLimited).toBe(false);
  });
});
