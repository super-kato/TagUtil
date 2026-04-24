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
  const isContentEditable = (active as HTMLElement).isContentEditable;

  return isInput || isTextArea || isContentEditable;
};
