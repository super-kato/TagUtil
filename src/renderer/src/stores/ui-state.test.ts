import { describe, it, expect, beforeEach } from 'vitest';
import { uiState } from './ui-state.svelte';

describe('UiState', () => {
  beforeEach(() => {
    uiState.reset();
  });

  it('初期状態が正しいこと', () => {
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

  it('setScanLimited で isScanLimited が更新されること', () => {
    uiState.setScanLimited(true);
    expect(uiState.isScanLimited).toBe(true);
    uiState.setScanLimited(false);
    expect(uiState.isScanLimited).toBe(false);
  });

  it('reset で全ての状態が初期化されること', () => {
    uiState.startLoading();
    uiState.setScanLimited(true);

    uiState.reset();

    expect(uiState.isLoading).toBe(false);
    expect(uiState.isScanLimited).toBe(false);
  });
});
