import { describe, it, expect, beforeEach } from 'vitest';
import { uiState } from './ui-state.svelte';

describe('UiState', () => {
  beforeEach(() => {
    uiState.stopLoading();
  });

  it('初期状態が正しいこと', () => {
    expect(uiState.isLoading).toBe(false);
    expect(uiState.isSettingsOpen).toBe(false);
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

  it('openSettings で isSettingsOpen が true になること', () => {
    uiState.openSettings();
    expect(uiState.isSettingsOpen).toBe(true);
  });

  it('closeSettings で isSettingsOpen が false になること', () => {
    uiState.openSettings();
    uiState.closeSettings();
    expect(uiState.isSettingsOpen).toBe(false);
  });
});
