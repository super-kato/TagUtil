<script lang="ts">
  import { tagActions } from '@renderer/services/tag-actions';
  import { selectionState } from '@renderer/stores/selection-state.svelte';
  import { trackStore } from '@renderer/stores/track-store.svelte';
  import { uiState } from '@renderer/stores/ui-state.svelte';
  import { KeyboardHandler, type KeyboardAction } from '@renderer/utils/keyboard-handler';

  import { IS_MAC } from '@renderer/constants/platform';
  import { isInputFocused } from '@renderer/utils/dom-utils';

  const rawActions: KeyboardAction[] = [
    {
      combo: { key: 'a', ctrl: true },
      handler: () => selectionState.selectAll(trackStore.tracks),
      enabled: () => !isInputFocused() && !uiState.isLoading
    },
    {
      combo: { key: 'o', ctrl: true },
      handler: () => tagActions.openAndScanDirectory(),
      enabled: () => !uiState.isLoading
    },
    {
      combo: { key: 's', ctrl: true },
      handler: () => tagActions.saveAllModified(),
      enabled: () => !uiState.isLoading
    },
    {
      combo: { key: 'ArrowUp' },
      handler: () => selectionState.selectPrevious(trackStore.tracks),
      enabled: () => !isInputFocused() && !uiState.isLoading
    },
    {
      combo: { key: 'ArrowDown' },
      handler: () => selectionState.selectNext(trackStore.tracks),
      enabled: () => !isInputFocused() && !uiState.isLoading
    }
  ];

  const handler = new KeyboardHandler(
    IS_MAC,
    rawActions.map((action) => ({
      preventDefault: true,
      ...action
    }))
  );
</script>

<svelte:window onkeydown={(e) => handler.handle(e)} />
