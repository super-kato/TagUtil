<script lang="ts">
  import { selectionState } from '@renderer/stores/selection-state.svelte';
  import { trackStore } from '@renderer/stores/track-store.svelte';
  import { uiState } from '@renderer/stores/ui-state.svelte';
  import { tagActions } from '@renderer/services/tag-actions';
  import { KeyboardHandler } from '@renderer/utils/keyboard-handler';
  import { isFocusedOnInput } from '@renderer/utils/dom-utils';
  import { IS_MAC } from '@renderer/constants/platform';

  const isNotEditing = (): boolean => !isFocusedOnInput();

  const handleSelectAll = (): void => {
    selectionState.selectAll(trackStore.tracks);
  };
  const handleSaveAll = async (): Promise<void> => {
    await tagActions.saveAllModified();
  };
  const handleSelectPrevious = (): void => {
    selectionState.selectPrevious(trackStore.tracks);
  };
  const handleSelectNext = (): void => {
    selectionState.selectNext(trackStore.tracks);
  };

  const handler = new KeyboardHandler(IS_MAC, [
    {
      combo: { key: 'a', mod: true },
      handler: handleSelectAll,
      preventDefault: true,
      enabled: isNotEditing
    },
    {
      combo: { key: 's', mod: true },
      handler: handleSaveAll,
      preventDefault: true,
      enabled: isNotEditing
    },
    {
      combo: { key: 'ArrowUp' },
      handler: handleSelectPrevious,
      preventDefault: true,
      enabled: isNotEditing
    },
    {
      combo: { key: 'ArrowDown' },
      handler: handleSelectNext,
      preventDefault: true,
      enabled: isNotEditing
    }
  ]);

  const onKeyDown = (e: KeyboardEvent): void => {
    if (uiState.isLoading) {
      return;
    }
    handler.handle(e);
  };
</script>

<svelte:window onkeydown={onKeyDown} />
