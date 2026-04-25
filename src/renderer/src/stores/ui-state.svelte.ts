import type { Failure } from '@domain/common/result';
import type { TagError } from '@domain/flac/types';
import { formatTagError } from '@renderer/utils/tag-error-formatter';

/**
 * アプリケーション全体の通知・ステータスメッセージを管理するストア。
 */
class UiState {
  #error = $state<string | null>(null);
  #isLoading = $state(false);
  #isScanLimited = $state(false);

  get error(): string | null {
    return this.#error;
  }

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

  setError(item: Failure<TagError>): void {
    this.#error = formatTagError(item.error);
  }

  /**
   * 現在表示されているエラーメッセージを消去します。
   */
  clearError(): void {
    this.#error = null;
  }

  /**
   * スキャンの件数制限に達したかどうかのフラグを更新します。
   */
  setScanLimited(limited: boolean): void {
    this.#isScanLimited = limited;
  }

  /**
   * エラー報告および制限フラグを含むすべての状態をリセットします。
   */
  reset(): void {
    this.clearError();
    this.stopLoading();
    this.#isScanLimited = false;
  }
}

export const uiState = new UiState();
