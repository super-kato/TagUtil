<script lang="ts">
  import { selectionState } from '@renderer/stores/selection-state.svelte';
  import { trackStore } from '@renderer/stores/track-store.svelte';
  import { uiState } from '@renderer/stores/ui-state.svelte';
  import { tagActions } from '@renderer/services/tag-actions';
  import { KeyboardHandler, type KeyboardAction } from '@renderer/utils/keyboard-handler';

  import { isInputFocused } from '@renderer/utils/dom-utils';
  import { IS_MAC } from '@renderer/constants/platform';

  const rawActions: KeyboardAction[] = [
    {
      combo: { key: 'a', ctrl: true },
      handler: () => selectionState.selectAll(trackStore.tracks)
    },
    {
      combo: { key: 's', ctrl: true },
      handler: () => tagActions.saveAllModified(),
      enabled: () => !uiState.isLoading
    },
    {
      combo: { key: 'ArrowUp' },
      handler: () => selectionState.selectPrevious(trackStore.tracks)
    },
    {
      combo: { key: 'ArrowDown' },
      handler: () => selectionState.selectNext(trackStore.tracks)
    }
  ];

  const handler = new KeyboardHandler(
    IS_MAC,
    rawActions.map((action) => ({
      preventDefault: true,
      ...action,
      enabled: action.enabled ?? (() => !isInputFocused() && !uiState.isLoading)
    }))
  );
</script>

<svelte:window onkeydown={(e) => handler.handle(e)} />
