import type { Failure } from '@domain/common/result';
import type { TagError } from '@domain/flac/types';
import { formatTagError } from '@utils/tag-error-formatter';

/**
 * アプリケーション全体の通知・ステータスメッセージを管理するストア。
 */
class UiState {
  error = $state<string | null>(null);
  isLoading = $state(false);
  isScanLimited = $state(false);

  startLoading(): void {
    this.isLoading = true;
  }

  stopLoading(): void {
    this.isLoading = false;
  }

  setError(item: Failure<TagError>): void {
    this.error = formatTagError(item.error);
  }

  /**
   * 現在表示されているエラーメッセージを消去します。
   */
  clearError(): void {
    this.error = null;
  }

  /**
   * スキャンの件数制限に達したかどうかのフラグを更新します。
   */
  setScanLimited(limited: boolean): void {
    this.isScanLimited = limited;
  }

  /**
   * エラー報告および制限フラグを含むすべての状態をリセットします。
   */
  reset(): void {
    this.clearError();
    this.stopLoading();
    this.isScanLimited = false;
  }
}

export const uiState = new UiState();
