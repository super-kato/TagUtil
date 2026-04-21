import type { EditableSingleKey } from '@domain/editor/batch-metadata';
import { trackStore } from '@renderer/stores/track-store.svelte';
import { tagActions } from '@renderer/services/tag-actions';

/**
 * 単一値フィールドの入力イベントを処理し、trackStore を更新します。
 */
export const handleSingleInput = (key: EditableSingleKey, e: Event): void => {
  const input = e.target as HTMLInputElement;
  tagActions.updateSelectedSingleField(key, input.value);
};

/**
 * 指定された単一値フィールドの表示用の実効値を取得します。
 * Mixed Value（複数選択で値が異なる）状態の場合は、表示を空にします。
 */
export const getSingleFieldValue = (key: EditableSingleKey): string => {
  const common = trackStore.commonMetadata;
  if (!common) {
    return '';
  }

  const state = common[key];
  if (state.type !== 'uniform') {
    return '';
  }
  return state.value ?? '';
};
