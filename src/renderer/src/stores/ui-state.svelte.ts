/**
 * アプリケーション全体の共通的なUI状態（ローディング表示など）を管理するストア。
 */
class UiState {
  #isLoading = $state(false);
  #isSettingsOpen = $state(false);

  get isLoading(): boolean {
    return this.#isLoading;
  }

  get isSettingsOpen(): boolean {
    return this.#isSettingsOpen;
  }

  startLoading(): void {
    this.#isLoading = true;
  }

  stopLoading(): void {
    this.#isLoading = false;
  }

  openSettings(): void {
    this.#isSettingsOpen = true;
  }

  closeSettings(): void {
    this.#isSettingsOpen = false;
  }
}

export const uiState = new UiState();
