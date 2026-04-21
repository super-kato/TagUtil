<script lang="ts">
  import { uiState } from '@stores/ui-state.svelte';
  import { CircleAlert, TriangleAlert } from '@lucide/svelte';
  import { UI_TOKENS } from '@constants/design-system';
</script>

{#if uiState.error || uiState.isScanLimited}
  <footer
    class="status-bar"
    class:error={!!uiState.error}
    class:warning={!uiState.error && uiState.isScanLimited}
  >
    {#if uiState.error}
      <CircleAlert size={UI_TOKENS.icons.size} />
      <span>{uiState.error}</span>
    {:else if uiState.isScanLimited}
      <TriangleAlert size={UI_TOKENS.icons.size} />
      <span>Scan limit (500 items) reached. Some files were skipped.</span>
    {/if}
  </footer>
{/if}

<style>
  .status-bar {
    color: white;
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .status-bar.error {
    background-color: var(--accent-error);
  }

  .status-bar.warning {
    background-color: var(--accent-warning);
    color: var(--bg-body);
    font-weight: 500;
  }
</style>
