/**
 * アプリケーション全体の共通的なUI状態（ローディング表示など）を管理するストア。
 */
class UiState {
  #isLoading = $state(false);

  get isLoading(): boolean {
    return this.#isLoading;
  }

  startLoading(): void {
    this.#isLoading = true;
  }

  stopLoading(): void {
    this.#isLoading = false;
  }
}

export const uiState = new UiState();
