import { tooltipStore } from '@renderer/stores/tooltip-store.svelte';
import { generateId } from '@shared/utils/id';
import type { Action } from 'svelte/action';

const ANCHOR_PROPERTY = 'anchor-name';
const ANCHOR_PREFIX = '--tooltip-anchor-';
const SHOW_DELAY = 500;

/**
 * ツールチップを表示するためのSvelte Action。
 * Store を介して表示を制御し、位置計算は CSS Anchor Positioning API に委譲します。
 */
export const tooltip: Action<HTMLElement, string | undefined> = (node, text) => {
  let currentText = text;
  let showTimer: ReturnType<typeof setTimeout> | undefined;

  // 各要素に一意のアンカー名を付与するためのID
  const anchorName = `${ANCHOR_PREFIX}${generateId()}`;

  const show = (): void => {
    if (!currentText || showTimer) {
      return;
    }

    showTimer = setTimeout(() => {
      // 自身のアンカー名を設定し、Store を更新して表示を依頼
      node.style.setProperty(ANCHOR_PROPERTY, anchorName);
      tooltipStore.show(currentText!, anchorName);
      showTimer = undefined;
    }, SHOW_DELAY);
  };

  const hide = (): void => {
    if (showTimer) {
      clearTimeout(showTimer);
      showTimer = undefined;
    }
    tooltipStore.hide();
  };

  const handleUpdate = (newText: string | undefined): void => {
    currentText = newText;

    if (!tooltipStore.isVisible || tooltipStore.anchorName !== anchorName) {
      return;
    }

    if (newText) {
      tooltipStore.show(newText, anchorName);
      return;
    }

    tooltipStore.hide();
  };

  const handleDestroy = (): void => {
    if (tooltipStore.anchorName === anchorName) {
      hide();
    }
    node.removeEventListener('mouseenter', show);
    node.removeEventListener('mouseleave', hide);
  };

  node.addEventListener('mouseenter', show);
  node.addEventListener('mouseleave', hide);

  return {
    update: handleUpdate,
    destroy: handleDestroy
  };
};
