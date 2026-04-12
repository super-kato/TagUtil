<script lang="ts">
  import { UI_TOKENS } from '@renderer/constants/design-system';
  import { Disc3, FolderOpen, RotateCcw, Save } from 'lucide-svelte';
  import { tagState } from '../stores/tag-state.svelte';
</script>

<header class="toolbar">
  <div class="brand">
    <h1>TagUtil</h1>
  </div>
  <div class="actions">
    <button
      class="btn secondary"
      onclick={() => tagState.openAndScanDirectory()}
      title="Open Directory"
    >
      <FolderOpen size={UI_TOKENS.icons.size} />
    </button>
    <button
      class="btn revert"
      onclick={() => tagState.revertSelected()}
      disabled={tagState.isLoading || !tagState.selectedTracks.some((t) => t.isModified)}
      title="Revert Changes"
    >
      <RotateCcw size={UI_TOKENS.icons.size} />
    </button>
    <button
      class="btn primary"
      onclick={() => tagState.saveAllModified()}
      disabled={tagState.isLoading || !tagState.tracks.some((t) => t.isModified)}
      title="Save Changes"
    >
      {#if tagState.isLoading}
        <Disc3 size={UI_TOKENS.icons.size} class="spin" />
      {:else}
        <Save size={UI_TOKENS.icons.size} />
      {/if}
    </button>
  </div>
</header>

<style>
  .toolbar {
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--bg-inspector);
    border-bottom: 1px solid var(--border-primary);
  }

  .brand h1 {
    font-size: 1.2rem;
    font-weight: 300;
    margin: 0;
    letter-spacing: 1px;
    color: var(--text-primary);
  }

  .actions {
    display: flex;
    gap: 0.75rem;
  }

  .btn {
    padding: 0.5rem;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-size: 0.85rem;
    transition: filter 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn:hover {
    filter: brightness(1.2);
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .primary,
  .secondary,
  .revert {
    background-color: #3d3d3d; /* まだ役割が不明確な中間色は一旦維持 */
    color: var(--text-secondary);
  }

  .primary:enabled {
    color: var(--accent-primary);
  }

  .revert:enabled {
    color: var(--accent-warning);
  }
</style>
