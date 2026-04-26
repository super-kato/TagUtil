import type { EditableSingleKey, FieldState } from '@domain/editor/batch-metadata';
import { trackStore } from '@renderer/stores/track-store.svelte';
import { tagActions } from '@renderer/services/tag-actions';

/**
 * 単一値フィールドの変更イベントを処理し、trackStore を更新します。
 * 通常、blur または Enter キー押下時に呼び出されます。
 */
export const handleSingleFieldChange = (key: EditableSingleKey, e: Event): void => {
  const input = e.target as HTMLInputElement;
  tagActions.updateSelectedSingleField(key, input.value);
};

/**
 * Enterキーが押された際、入力欄からフォーカスを外します。
 * これにより blur イベントが発火し、変更が確定されます。
 */
export const handleEnterKey = (e: KeyboardEvent): void => {
  if (e.key === 'Enter') {
    (e.target as HTMLElement).blur();
  }
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

/**
 * 複数値フィールドの表示用の実効値リストを取得します。
 * Uniform の場合はその値を、Divergent の場合は和（union）を返します。
 */
export const getMultiFieldValues = (state: FieldState<string[] | undefined>): string[] => {
  if (state.type === 'uniform') {
    return state.value ?? [];
  }
  if (state.type === 'divergent') {
    return state.values ?? [];
  }
  return [];
};
