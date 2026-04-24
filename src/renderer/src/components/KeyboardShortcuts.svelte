<script lang="ts">
  import { selectionState } from '@renderer/stores/selection-state.svelte';
  import { trackStore } from '@renderer/stores/track-store.svelte';
  import { uiState } from '@renderer/stores/ui-state.svelte';
  import { tagActions } from '@renderer/services/tag-actions';
  import { KeyboardHandler, type KeyboardAction } from '@renderer/utils/keyboard-handler';

  import { isFocusedOnInput } from '@renderer/utils/dom-utils';
  import { IS_MAC } from '@renderer/constants/platform';

  const rawActions: KeyboardAction[] = [
    {
      combo: { key: 'a', ctrl: true },
      handler: () => selectionState.selectAll(trackStore.tracks)
    },
    {
      combo: { key: 's', ctrl: true },
      handler: () => tagActions.saveAllModified()
    },
    {
      combo: { key: 'ArrowUp', alt: true },
      handler: () => selectionState.selectPrevious(trackStore.tracks)
    },
    {
      combo: { key: 'ArrowDown', alt: true },
      handler: () => selectionState.selectNext(trackStore.tracks)
    }
  ];

  const handler = new KeyboardHandler(
    IS_MAC,
    rawActions.map((action) => ({
      ...action,
      preventDefault: true,
      enabled: () => !isFocusedOnInput() && !uiState.isLoading
    }))
  );

  const onKeyDown = (e: KeyboardEvent): void => {
    handler.handle(e);
  };
</script>

<svelte:window onkeydown={onKeyDown} />
