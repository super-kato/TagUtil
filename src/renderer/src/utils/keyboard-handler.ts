import type { KeyboardKey } from './keyboard-types';

/**
 * キーボードハンドラーの動作オプションです。
 */
export interface KeyboardHandlerOptions {
  // 現在オプションはありませんが、将来の拡張のために残しています
}

/**
 * キーボードショートカットの組み合わせを定義します。
 */
export interface KeyCombo {
  /** キー名。 */
  key: KeyboardKey;
  /** Ctrlキーが必要かどうか。 */
  ctrl?: boolean;
  /** Shiftキーが必要かどうか。 */
  shift?: boolean;
  /** Altキーが必要かどうか。 */
  alt?: boolean;
  /** Metaキーが必要かどうか。 */
  meta?: boolean;
  /** 実行環境に応じた修飾キー（特定の環境で Meta, それ以外で Ctrl）を自動選択したい場合に指定します。 */
  mod?: boolean;
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
   * @param useMetaAsMod mod 指定がある場合に、Meta キーを優先して判定するかどうか。
   * @param actions 登録するアクションの一覧。
   * @param isFocusedOnInput 入力要素にフォーカスがあるかどうかを判定する関数。
   */
  constructor(
    private readonly useMetaAsMod: boolean,
    private readonly actions: KeyboardAction[],
    private readonly isFocusedOnInput: () => boolean
  ) {}

  /**
   * キーボードイベントを処理します。
   */
  handle(e: KeyboardEvent): void {
    // 入力要素にフォーカスがある場合はアクションをスキップ
    if (this.isFocusedOnInput()) {
      return;
    }

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

    const result = action.handler(e);
    if (result instanceof Promise) {
      result.catch(console.error);
    }
  }

  /**
   * イベントが組み合わせにマッチするかどうかを判定します。
   */
  private matches(e: KeyboardEvent, combo: KeyCombo): boolean {
    const keyMatch = e.key.toLowerCase() === combo.key.toLowerCase();
    const shiftMatch = !!e.shiftKey === !!combo.shift;
    const altMatch = !!e.altKey === !!combo.alt;

    // mod キー（特定の環境で Meta、それ以外で Ctrl として扱われるキー）の判定
    const expectedCtrl = combo.mod ? !this.useMetaAsMod : !!combo.ctrl;
    const expectedMeta = combo.mod ? this.useMetaAsMod : !!combo.meta;

    const ctrlMatch = !!e.ctrlKey === expectedCtrl;
    const metaMatch = !!e.metaKey === expectedMeta;

    return keyMatch && ctrlMatch && metaMatch && shiftMatch && altMatch;
  }
}
