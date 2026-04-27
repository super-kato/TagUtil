import type { ColorTheme } from '@shared/settings';

/**
 * 現在のフォーカスが入力可能な要素（INPUT, TEXTAREA, contenteditable）にあるかどうかを判定します。
 */
export const isInputFocused = (): boolean => {
  const active = document.activeElement;
  if (!active) {
    return false;
  }

  const isInput = active.tagName === 'INPUT';
  const isTextArea = active.tagName === 'TEXTAREA';
  const isContentEditable = !!(active as HTMLElement).isContentEditable;

  return isInput || isTextArea || isContentEditable;
};

/**
 * アプリケーションのカラーテーマをドキュメントルートに適用します。
 * @param theme 適用するテーマ
 */
export const setAppTheme = (theme: ColorTheme): void => {
  document.documentElement.setAttribute('data-theme', theme);
};
