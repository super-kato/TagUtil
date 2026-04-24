/**
 * 現在のフォーカスが入力要素（INPUT, TEXTAREA, contenteditable）にあるかどうかを判定します。
 */
export const isFocusedOnInput = (): boolean => {
  const active = document.activeElement;
  if (!active) {
    return false;
  }

  const isInput = active.tagName === 'INPUT';
  const isTextArea = active.tagName === 'TEXTAREA';
  const isContentEditable = (active as HTMLElement).isContentEditable;

  return isInput || isTextArea || isContentEditable;
};
