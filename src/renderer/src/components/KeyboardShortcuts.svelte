<script lang="ts">
  import { selectionState } from '../stores/selection-state.svelte';
  import { trackStore } from '../stores/track-store.svelte';
  import { uiState } from '../stores/ui-state.svelte';
  import { tagActions } from '../services/tag-actions';

  // 編集中の要素（INPUT等）にフォーカスがあるか判定
  const isEditing = (): boolean => {
    const active = document.activeElement;
    return !!(active && (active.tagName === 'INPUT' || (active as HTMLElement).isContentEditable));
  };

  // 全選択アクション
  const handleSelectAll = (e: KeyboardEvent): void => {
    if (isEditing()) {
      return;
    }
    e.preventDefault();
    selectionState.selectAll(trackStore.tracks);
  };

  // 保存アクション
  const handleSave = (e: KeyboardEvent): void => {
    if (isEditing()) {
      return;
    }
    e.preventDefault();
    tagActions.saveAllModified();
  };

  const handleKeydown = (e: KeyboardEvent): void => {
    // Ctrl(Cmd) キーが押されていない場合は何もしない
    if (!(e.ctrlKey || e.metaKey)) {
      return;
    }

    // 処理中の場合はすべてのショートカットを無視
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
</script>

<svelte:window onkeydown={handleKeydown} />
