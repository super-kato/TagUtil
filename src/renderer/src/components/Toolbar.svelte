<script lang="ts">
  import { UI_TOKENS } from '@renderer/constants/design-system';
  import { Disc3, FilePen, FolderOpen, RotateCcw, Save, Tag } from '@lucide/svelte';
  import { tagActions } from '@renderer/services/tag-actions';
  import { fileActions } from '@renderer/services/file-actions';
  import { trackStore } from '@renderer/stores/track-store.svelte';
  import { uiState } from '@renderer/stores/ui-state.svelte';
  import { modalStore } from '@renderer/stores/modal-store.svelte';

  const handleRenameClick = async (): Promise<void> => {
    const ok = await modalStore.confirm({
      title: 'Rename Files',
      message:
        `Rename ${trackStore.selectedTracks.length} selected files based on metadata?\n` +
        `Format: {trackNumber} - {title}.flac`,
      confirmLabel: 'Rename'
    });
    if (!ok) {
      return;
    }

    fileActions.renameSelectedFiles();
  };
</script>

<header class="toolbar">
  <div class="brand">
    <Tag
      size={UI_TOKENS.icons.logoSize}
      color="var(--text-primary)"
      strokeWidth={UI_TOKENS.icons.strokeBold}
      class="logo-icon"
    />
    <h1>TagUtil</h1>
  </div>
  <div class="actions">
    <button
      class="btn secondary"
      onclick={() => tagActions.openAndScanDirectory()}
      disabled={uiState.isLoading}
      title="Open Directory"
    >
      <FolderOpen size={UI_TOKENS.icons.size} />
    </button>
    <div class="divider"></div>
    <button
      class="btn secondary"
      onclick={handleRenameClick}
      disabled={uiState.isLoading || trackStore.selectedTracks.length === 0}
      title="Rename Files from Metadata"
    >
      <FilePen size={UI_TOKENS.icons.size} />
    </button>
    <button
      class="btn revert"
      onclick={() => tagActions.revertSelected()}
      disabled={uiState.isLoading || !trackStore.selectedTracks.some((t) => t.isModified)}
      title="Revert Changes"
    >
      <RotateCcw size={UI_TOKENS.icons.size} />
    </button>
    <button
      class="btn primary"
      onclick={() => tagActions.saveAllModified()}
      disabled={uiState.isLoading || !trackStore.tracks.some((t) => t.isModified)}
      title="Save Changes"
    >
      {#if uiState.isLoading}
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

  .brand {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  :global(.brand .logo-icon) {
    margin-top: 0.1rem; /* 視覚的な中央揃えの微調整 */
  }

  .brand h1 {
    font-size: 1.2rem;
    font-weight: 300;
    margin: 0;
    line-height: 1;
    letter-spacing: 1px;
    color: var(--text-primary);
  }

  .actions {
    display: flex;
    gap: 0.75rem;
  }

  .btn {
    padding: 0.5rem;
    border-radius: var(--radius-md);
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

  .divider {
    width: 1px;
    height: 1.5rem;
    background-color: var(--border-primary);
    margin: 0 0.25rem;
    align-self: center;
  }
</style>
