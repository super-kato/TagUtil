<script lang="ts">
  import { selectionState } from '@renderer/stores/selection-state.svelte';
  import { trackStore } from '@renderer/stores/track-store.svelte';
  import { uiState } from '@renderer/stores/ui-state.svelte';
  import { tagActions } from '@renderer/services/tag-actions';

  /**
   * 編集中の要素（INPUT等）にフォーカスがあるか判定します。
   */
  const isEditing = (): boolean => {
    const active = document.activeElement;
    return !!(active && (active.tagName === 'INPUT' || (active as HTMLElement).isContentEditable));
  };

  /**
   * 全選択アクションを実行します。
   */
  const handleSelectAll = (e: KeyboardEvent): void => {
    if (isEditing()) {
      return;
    }
    e.preventDefault();
    selectionState.selectAll(trackStore.tracks);
  };

  /**
   * 全修正の保存アクションを実行します。
   */
  const handleSave = (e: KeyboardEvent): void => {
    e.preventDefault();
    tagActions.saveAllModified();
  };

  /**
   * Modifier (Ctrl/Cmd) 系ショートカット（Save, SelectAll など）を処理します。
   */
  const handleModifierShortcuts = (e: KeyboardEvent): void => {
    if (uiState.isLoading) {
      return;
    }

    switch (e.key.toLowerCase()) {
      case 'a':
        handleSelectAll(e);
        break;
      case 's':
        handleSave(e);
        break;
    }
  };

  /**
   * ナビゲーション（上下移動）系ショートカットを処理します。
   */
  const handleNavigation = (e: KeyboardEvent): void => {
    if (isEditing()) {
      return;
    }

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        selectionState.selectPrevious(trackStore.tracks);
        break;
      case 'ArrowDown':
        e.preventDefault();
        selectionState.selectNext(trackStore.tracks);
        break;
    }
  };

  const handleKeydown = (e: KeyboardEvent): void => {
    if (e.ctrlKey || e.metaKey) {
      handleModifierShortcuts(e);
    } else {
      handleNavigation(e);
    }
  };
</script>

<svelte:window onkeydown={handleKeydown} />
