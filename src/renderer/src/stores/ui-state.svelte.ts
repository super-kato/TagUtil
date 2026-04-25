/**
 * アプリケーション全体の通知・ステータスメッセージを管理するストア。
 */
class UiState {
  #isLoading = $state(false);
  #isScanLimited = $state(false);

  get isLoading(): boolean {
    return this.#isLoading;
  }

  get isScanLimited(): boolean {
    return this.#isScanLimited;
  }

  startLoading(): void {
    this.#isLoading = true;
  }

  stopLoading(): void {
    this.#isLoading = false;
  }

  /**
   * スキャンの件数制限に達したかどうかのフラグを更新します。
   */
  setScanLimited(limited: boolean): void {
    this.#isScanLimited = limited;
  }
}

export const uiState = new UiState();
