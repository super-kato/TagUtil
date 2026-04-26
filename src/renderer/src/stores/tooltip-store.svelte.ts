/**
 * ツールチップのグローバルな状態を管理します。
 */
class TooltipStore {
  /** ツールチップに表示するテキスト */
  #text = $state('');
  /** アンカーとなる要素のアンカー名 */
  #anchorName = $state('');
  /** 表示中かどうか */
  #isVisible = $state(false);

  /** 表示するテキストを取得します */
  get text(): string {
    return this.#text;
  }

  /** アンカー名を取得します */
  get anchorName(): string {
    return this.#anchorName;
  }

  /** 表示中かどうかを取得します */
  get isVisible(): boolean {
    return this.#isVisible;
  }

  /**
   * ツールチップを表示します。
   * @param text 表示するテキスト
   * @param anchorName アンカー名
   */
  show(text: string, anchorName: string): void {
    this.#text = text;
    this.#anchorName = anchorName;
    this.#isVisible = true;
  }

  /**
   * ツールチップを非表示にします。
   */
  hide(): void {
    this.#isVisible = false;
  }
}

export const tooltipStore = new TooltipStore();
