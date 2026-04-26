<script lang="ts">
  import { UI_TOKENS } from '@renderer/constants/design-system';
  import {
    Save,
    RotateCcw,
    FolderOpen,
    Eraser,
    FileDigit,
    Palette,
    Tag,
    Trash2
  } from '@lucide/svelte';
  import { tagActions } from '@renderer/services/tag-actions';
  import { trackStore } from '@renderer/stores/track-store.svelte';
  import { themeStore } from '@renderer/stores/theme-store.svelte';
  import { tooltip } from '@renderer/actions/tooltip';

  const hasSelected = $derived(trackStore.selectedTracks.length > 0);
  const hasModified = $derived(trackStore.isAnyModified);
</script>

<header class="toolbar">
  <div class="logo">
    <Tag size={UI_TOKENS.icons.logoSize} strokeWidth={UI_TOKENS.icons.strokeBold} />
    <span class="logo-text">TagUtil</span>
  </div>

  <div class="actions left">
    <button class="btn primary" onclick={tagActions.openAndScanDirectory} use:tooltip={'Open Folder'}>
      <FolderOpen size={UI_TOKENS.icons.size} />
      <span>Open</span>
    </button>

    <div class="divider"></div>

    <button
      class="btn primary"
      disabled={!hasModified}
      onclick={tagActions.saveModifiedTracks}
      use:tooltip={'Save changes to files'}
    >
      <Save size={UI_TOKENS.icons.size} />
      <span>Save</span>
    </button>

    <button
      class="btn revert"
      disabled={!hasModified}
      onclick={tagActions.revertModifiedTracks}
      use:tooltip={'Revert all unsaved changes'}
    >
      <RotateCcw size={UI_TOKENS.icons.size} />
    </button>

    <div class="divider"></div>

    <button
      class="btn secondary"
      disabled={!hasSelected}
      onclick={tagActions.renameSelectedTracks}
      use:tooltip={'Rename files based on tags'}
    >
      <FileDigit size={UI_TOKENS.icons.size} />
      <span>Rename</span>
    </button>

    <button
      class="btn secondary"
      disabled={!hasSelected}
      onclick={tagActions.clearSelectedTracksTags}
      use:tooltip={'Clear all tags from selected tracks'}
    >
      <Eraser size={UI_TOKENS.icons.size} />
    </button>

    <button
      class="btn secondary"
      disabled={!hasSelected}
      onclick={tagActions.removeSelectedTracks}
      use:tooltip={'Remove selected tracks from list'}
    >
      <Trash2 size={UI_TOKENS.icons.size} />
    </button>
  </div>

  <div class="actions right">
    <button class="btn theme-toggle" onclick={() => themeStore.toggleTheme()} use:tooltip={'Switch Theme'}>
      <Palette size={UI_TOKENS.icons.size} />
    </button>
  </div>
</header>

<style>
  .toolbar {
    height: 3.5rem;
    display: flex;
    align-items: center;
    padding: 0 1rem;
    background-color: var(--bg-header);
    border-bottom: 1px solid var(--border-primary);
    gap: 1.5rem;
    z-index: 100;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    color: var(--accent-primary);
    padding-right: 0.5rem;
  }

  .logo-text {
    font-size: 1.1rem;
    font-weight: 800;
    letter-spacing: -0.02rem;
    background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-modified) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .actions.left {
    flex: 1;
  }

  .divider {
    width: 1px;
    height: 1.5rem;
    background-color: var(--border-primary);
    margin: 0 0.5rem;
  }

  .btn {
    height: 2.25rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0 0.85rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-primary);
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .primary,
  .secondary,
  .revert {
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

  .btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    filter: grayscale(0.8);
  }

  .theme-toggle {
    background: transparent;
    border-color: transparent;
    color: var(--text-muted);
  }

  .theme-toggle:hover {
    background: var(--bg-hover);
    color: var(--accent-primary);
  }
</style>
