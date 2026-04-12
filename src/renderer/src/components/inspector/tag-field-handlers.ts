import type { EditableSingleKey } from '@domain/editor/batch-metadata';
import { tagState } from '../../stores/tag-state.svelte';

/**
 * 単一値フィールドの入力イベントを処理し、tagState を更新します。
 */
export const handleSingleInput = (key: EditableSingleKey, e: Event): void => {
  const input = e.target as HTMLInputElement;
  tagState.updateSelectedSingleField(key, input.value);
};

/**
 * 指定された単一値フィールドの表示用の実効値を取得します。
 * Mixed Value（複数選択で値が異なる）状態の場合は、表示を空にします。
 */
export const getSingleFieldValue = (key: EditableSingleKey): string => {
  const common = tagState.commonMetadata;
  if (!common) {
    return '';
  }

  const state = common[key];
  if (state.type !== 'uniform') {
    return '';
  }
  return state.value ?? '';
};
