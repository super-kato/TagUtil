<script lang="ts">
  import { Disc3, FilePen, FolderOpen, Save, Settings, Tag, Undo2 } from '@lucide/svelte';
  import { UI_TOKENS } from '@renderer/constants/design-system';
  import { fileActions } from '@renderer/services/file-actions';
  import { tagActions } from '@renderer/services/tag-actions';
  import { modalStore } from '@renderer/stores/modal-store.svelte';
  import { trackStore } from '@renderer/stores/track-store.svelte';
  import { uiState } from '@renderer/stores/ui-state.svelte';

  const handleRenameClick = async (): Promise<void> => {
    const ok = await modalStore.confirm({
      title: 'Rename Files',
      message:
        `Rename ${trackStore.selectedTracks.length} selected files based on metadata?\n` +
        `Format: {trackNumber} - {title}.flac`,
      icon: FilePen
    });
    if (!ok) {
      return;
    }

    fileActions.renameSelectedFiles();
  };

  const canRename = $derived(!uiState.isLoading && trackStore.selectedTracks.length > 0);
  const canRevert = $derived(
    !uiState.isLoading && trackStore.selectedTracks.some((t) => t.isModified)
  );
  const canSave = $derived(!uiState.isLoading && trackStore.tracks.some((t) => t.isModified));
</script>

<header class="toolbar" data-testid="toolbar">
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
      class="btn"
      onclick={tagActions.openAndScanDirectory}
      disabled={uiState.isLoading}
      title="Open Directory"
      data-testid="open-directory-button"
    >
      <FolderOpen size={UI_TOKENS.icons.size} />
    </button>
    <div class="divider"></div>
    <button
      class="btn"
      onclick={handleRenameClick}
      disabled={!canRename}
      title="Rename Files from Metadata"
    >
      <FilePen size={UI_TOKENS.icons.size} />
    </button>
    <button
      class="btn revert"
      onclick={() => tagActions.revertSelected()}
      disabled={!canRevert}
      title="Revert Changes"
    >
      <Undo2 size={UI_TOKENS.icons.size} />
    </button>
    <button
      class="btn primary"
      class:glow-pulse={canSave}
      onclick={() => tagActions.saveAllModified()}
      disabled={!canSave}
      title="Save Changes"
      data-testid="save-changes-button"
    >
      {#if uiState.isLoading}
        <Disc3 size={UI_TOKENS.icons.size} class="spin" />
      {:else}
        <Save size={UI_TOKENS.icons.size} />
      {/if}
    </button>
    <div class="divider"></div>
    <button class="btn" onclick={() => uiState.openSettings()} title="Settings">
      <Settings size={UI_TOKENS.icons.size} />
    </button>
  </div>
</header>

<style>
  .toolbar {
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--bg-main);
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
    width: 2.25rem;
    height: 2.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-primary);
    cursor: pointer;
    transition: all 0.2s ease;
    background-color: var(--bg-button);
    color: var(--text-secondary);
  }

  .btn:hover:enabled {
    background-color: var(--bg-button-hover);
    filter: brightness(1.1);
  }

  .primary:enabled {
    color: var(--accent-primary);
  }

  .revert:enabled {
    color: var(--accent-warning);
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .divider {
    width: 1px;
    height: 1.5rem;
    background-color: var(--border-primary);
    margin: 0 0.25rem;
    align-self: center;
  }
</style>
