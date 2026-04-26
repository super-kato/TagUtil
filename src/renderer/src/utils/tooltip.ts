import type { Action } from 'svelte/action';

/**
 * グローバルなツールチップ要素のID。
 * アプリ全体で1つのポップオーバー要素を使い回します。
 */
const TOOLTIP_ID = 'global-tooltip';
const POPOVER_CLASS = 'custom-tooltip-popover';

const RANDOM_BASE = 36;
const ID_START = 2;
const ID_END = 9;

/**
 * ツールチップを表示するためのSvelte Action。
 * CSS Anchor Positioning API を活用し、位置計算をブラウザに委譲します。
 */
export const tooltip: Action<HTMLElement, string | undefined> = (node, text) => {
  let currentText = text;

  // 各要素に一意のアンカー名を付与するためのID
  const uniqueId = Math.random().toString(RANDOM_BASE).substring(ID_START, ID_END);
  const anchorName = `--tooltip-anchor-${uniqueId}`;

  const ensureTooltipElement = (): HTMLElement => {
    let el = document.getElementById(TOOLTIP_ID);
    if (!el) {
      el = document.createElement('div');
      el.id = TOOLTIP_ID;
      el.setAttribute('popover', 'manual');
      el.className = POPOVER_CLASS;
      document.body.appendChild(el);
    }
    return el;
  };

  const show = (): void => {
    if (!currentText) {
      return;
    }

    const el = ensureTooltipElement();
    el.textContent = currentText;

    // アンカーの設定
    node.style.setProperty('anchor-name', anchorName);
    el.style.setProperty('position-anchor', anchorName);

    el.showPopover();

    // フェードイン用のクラス付与
    requestAnimationFrame(() => {
      el.classList.add('visible');
    });
  };

  const hide = (): void => {
    const el = document.getElementById(TOOLTIP_ID);
    if (el) {
      el.classList.remove('visible');
      el.hidePopover();
    }
  };

  node.addEventListener('mouseenter', show);
  node.addEventListener('mouseleave', hide);

  return {
    update(newText) {
      currentText = newText;
      const el = document.getElementById(TOOLTIP_ID);
      if (el && el.classList.contains('visible')) {
        el.textContent = newText ?? '';
      }
    },
    destroy() {
      hide();
      node.removeEventListener('mouseenter', show);
      node.removeEventListener('mouseleave', hide);
    }
  };
};
