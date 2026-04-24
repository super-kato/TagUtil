import type { KeyboardKey } from './keyboard-types';

/**
 * キーボードショートカットの組み合わせを定義します。
 */
export interface KeyCombo {
  /** キー名。 */
  key: KeyboardKey;
  /** 修飾キー（MacではCommand、それ以外ではControl）。 */
  ctrl?: boolean;
  /** Shiftキーが必要かどうか。 */
  shift?: boolean;
  /** Altキーが必要かどうか。 */
  alt?: boolean;
}

/**
 * キーボードアクションの定義です。
 */
export interface KeyboardAction {
  /** キーの組み合わせ。 */
  combo: KeyCombo;
  /** 実行されるコールバック関数。 */
  handler: (e: KeyboardEvent) => void | Promise<void>;
  /** trueの場合、e.preventDefault() を呼び出します。デフォルトは false。 */
  preventDefault?: boolean;
  /**
   * アクションを実行するかどうかの追加判定。
   * false を返すと、キーが一致していてもアクションは実行されません。
   */
  enabled?: (e: KeyboardEvent) => boolean;
}

/**
 * キーボードイベントの判定と実行を管理するクラスです。
 * 実行環境や DOM 状態に直接依存せず、注入された設定と判定関数に基づいて処理を行います。
 */
export class KeyboardHandler {
  /**
   * @param isMac macOS として動作するかどうか。true の場合、ctrl 指定を Command キーとして判定します。
   * @param actions 登録するアクションの一覧。
   */
  constructor(
    private readonly isMac: boolean,
    private readonly actions: KeyboardAction[]
  ) {}

  /**
   * キーボードイベントを処理します。
   */
  async handle(e: KeyboardEvent): Promise<void> {
    const action = this.actions.find((a) => this.matches(e, a.combo));
    if (!action) {
      return;
    }

    if (action.enabled && !action.enabled(e)) {
      return;
    }

    if (action.preventDefault) {
      e.preventDefault();
    }

    await action.handler(e);
  }

  /**
   * イベントが組み合わせにマッチするかどうかを判定します。
   */
  private matches(e: KeyboardEvent, combo: KeyCombo): boolean {
    const keyMatch = e.key.toLowerCase() === combo.key.toLowerCase();
    const shiftMatch = !!e.shiftKey === !!combo.shift;
    const altMatch = !!e.altKey === !!combo.alt;

    // 修飾キーの判定（Macでは Command(Meta) キー、それ以外では Control キーを主修飾キーとする）
    const isModPressed = this.isMac ? !!e.metaKey : !!e.ctrlKey;
    const isOtherModPressed = this.isMac ? !!e.ctrlKey : !!e.metaKey;

    const modMatch = isModPressed === !!combo.ctrl;
    // 副修飾キー（MacでのCtrl、それ以外でのMeta/Win）は押されていないことを期待する
    const otherModMatch = !isOtherModPressed;

    return keyMatch && modMatch && otherModMatch && shiftMatch && altMatch;
  }
}
