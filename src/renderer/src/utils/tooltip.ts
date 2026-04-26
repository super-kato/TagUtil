import type { Action } from 'svelte/action';

/** ツールチップと要素の間のオフセット (px) */
const TOOLTIP_OFFSET = 8;
/** 画面端からの最小マージン (px) */
const SCREEN_MARGIN = 8;
/** 中央配置などの計算に使用する除数 */
const DIVISOR_HALF = 2;

/**
 * ツールチップを表示するためのSvelte Action。
 * HTML標準の title 属性の代わりに使用し、OSや親要素の overflow に依存しない表示を提供します。
 */
export const tooltip: Action<HTMLElement, string | undefined> = (node, text) => {
  let tooltipElement: HTMLDivElement | null = null;
  let currentText = text;

  const createTooltip = (): void => {
    if (!currentText || tooltipElement) {
      return;
    }

    tooltipElement = document.createElement('div');
    tooltipElement.className = 'custom-tooltip';
    tooltipElement.textContent = currentText;
    document.body.appendChild(tooltipElement);

    const rect = node.getBoundingClientRect();
    const tooltipRect = tooltipElement.getBoundingClientRect();

    // デフォルトは要素の中央上部
    let top = rect.top - tooltipRect.height - TOOLTIP_OFFSET;
    let left = rect.left + rect.width / DIVISOR_HALF - tooltipRect.width / DIVISOR_HALF;

    // 画面上端を越える場合は下に表示
    if (top < 0) {
      top = rect.bottom + TOOLTIP_OFFSET;
    }

    // 画面左右端を越えないように調整
    if (left < SCREEN_MARGIN) {
      left = SCREEN_MARGIN;
    } else if (left + tooltipRect.width > window.innerWidth - SCREEN_MARGIN) {
      left = window.innerWidth - tooltipRect.width - SCREEN_MARGIN;
    }

    tooltipElement.style.top = `${top}px`;
    tooltipElement.style.left = `${left}px`;

    // フェードイン（1フレーム待ってからクラスを付与）
    requestAnimationFrame(() => {
      if (tooltipElement) {
        tooltipElement.classList.add('visible');
      }
    });
  };

  const removeTooltip = (): void => {
    if (tooltipElement) {
      tooltipElement.remove();
      tooltipElement = null;
    }
  };

  const handleMouseEnter = (): void => {
    createTooltip();
  };

  const handleMouseLeave = (): void => {
    removeTooltip();
  };

  node.addEventListener('mouseenter', handleMouseEnter);
  node.addEventListener('mouseleave', handleMouseLeave);

  return {
    update(newText) {
      currentText = newText;
      if (tooltipElement) {
        tooltipElement.textContent = newText ?? '';
      }
    },
    destroy() {
      removeTooltip();
      node.removeEventListener('mouseenter', handleMouseEnter);
      node.removeEventListener('mouseleave', handleMouseLeave);
    }
  };
};
