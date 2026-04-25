import { describe, it, expect, beforeEach } from 'vitest';
import { uiState } from './ui-state.svelte';

describe('UiState', () => {
  beforeEach(() => {
    uiState.stopLoading();
    uiState.setScanLimited(false);
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

  it('状態をクリアできること', () => {
    uiState.startLoading();
    uiState.setScanLimited(true);

    uiState.stopLoading();
    uiState.setScanLimited(false);

    expect(uiState.isLoading).toBe(false);
    expect(uiState.isScanLimited).toBe(false);
  });
});
