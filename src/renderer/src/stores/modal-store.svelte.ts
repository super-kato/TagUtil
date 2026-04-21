/**
 * モーダルの設定オプション。
 */
export type ModalOptions = {
  /** モーダルのタイトル */
  title: string;
  /** モーダルの本文メッセージ */
  message: string;
  /** 確認ボタンのラベル (デフォルト: "OK") */
  confirmLabel?: string;
  /** キャンセルボタンのラベル (デフォルト: "Cancel") */
  cancelLabel?: string;
  /** ボタンの視覚的バリエーション */
  variant?: 'primary' | 'danger' | 'warning';
};

/**
 * カスタムダイアログの状態と動作を管理するストア。
 * ブラウザ標準の confirm() と同様の Promise ベースのインターフェースを提供します。
 */
class ModalStore {
  /** モーダルが開いているかどうか */
  isOpen = $state(false);

  /** 現在のモーダル設定 */
  options = $state<Required<ModalOptions>>({
    title: '',
    message: '',
    confirmLabel: 'OK',
    cancelLabel: 'Cancel',
    variant: 'primary'
  });

  private resolve: ((value: boolean) => void) | null = null;

  /**
   * 確認ダイアログを表示し、ユーザーの入力を Promise で返します。
   * @param options モーダルの設定
   * @returns ユーザーが確認した場合は true、キャンセルした場合は false
   */
  confirm(options: ModalOptions): Promise<boolean> {
    // 既存の Promise がある場合は、以前の呼び出しをキャンセル（false を返す）
    if (this.resolve) {
      this.resolve(false);
    }

    this.options = {
      confirmLabel: 'OK',
      cancelLabel: 'Cancel',
      variant: 'primary',
      ...options
    };
    this.isOpen = true;

    return new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  /**
   * 確認ボタンが押された時のハンドラ。
   */
  handleConfirm(): void {
    this.isOpen = false;
    this.resolve?.(true);
    this.resolve = null;
  }

  /**
   * キャンセルボタンが押された時、またはダイアログが閉じられた時のハンドラ。
   */
  handleCancel(): void {
    this.isOpen = false;
    this.resolve?.(false);
    this.resolve = null;
  }
}

export const modalStore = new ModalStore();
