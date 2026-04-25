<script lang="ts">
  import { UI_TOKENS } from '@renderer/constants/design-system';

  import { FolderOpen, Music } from '@lucide/svelte';
  import { tagActions } from '@renderer/services/tag-actions';
  import { selectionState } from '@renderer/stores/selection-state.svelte';
  import { TrackRecord } from '@renderer/stores/track-record.svelte';
  import { trackStore } from '@renderer/stores/track-store.svelte';
  import DropZone from '@renderer/components/ui/DropZone.svelte';
  import DropZoneOverlay from '@renderer/components/ui/DropZoneOverlay.svelte';

  const rowElements: HTMLElement[] = [];

  $effect(() => {
    const index = selectionState.lastSelectedIndex;
    if (index === null) {
      return;
    }
    const row = rowElements[index];
    if (!row) {
      return;
    }
    row.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });

  const handleRowClick = (e: MouseEvent, index: number, track: TrackRecord): void => {
    if (e.shiftKey && selectionState.lastSelectedIndex !== null) {
      const start = Math.min(selectionState.lastSelectedIndex, index);
      const end = Math.max(selectionState.lastSelectedIndex, index);
      const tracksToSelect = trackStore.tracks.slice(start, end + 1);
      selectionState.selectRange(tracksToSelect);
    } else {
      selectionState.selectSingle(track, index);
    }
  };
</script>

<DropZone onDrop={(paths) => tagActions.loadFromPaths(paths)}>
  {#snippet overlay()}
    <DropZoneOverlay icon={FolderOpen} title="Drop to scan FLAC files" sub="Release to open" />
  {/snippet}
  <div class="grid-wrapper no-focus-glow" tabindex="-1">
    {#if trackStore.tracks.length > 0}
      <table class="data-grid">
        <thead>
          <tr>
            <th class="col-indicator"></th>
            <th class="col-track">#</th>
            <th>Title</th>
            <th>Artist</th>
            <th>Album</th>
          </tr>
        </thead>
        <tbody>
          {#each trackStore.tracks as track, i (track)}
            <tr
              bind:this={rowElements[i]}
              class="track-row"
              class:selected={selectionState.has(track)}
              class:modified={track.isModified}
              onclick={(e) => handleRowClick(e, i, track)}
              aria-selected={selectionState.has(track)}
            >
              <td class="indicator-cell"></td>
              <td class="track-cell">{track.metadata.trackNumber ?? ''}</td>
              <td>{track.metadata.title}</td>
              <td>{track.metadata.artist}</td>
              <td>{track.metadata.album}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {:else}
      <div class="empty-state">
        <button
          class="empty-icon glow-pulse"
          onclick={tagActions.openAndScanDirectory}
          aria-label="Open Directory"
        >
          <Music size={UI_TOKENS.icons.sizeLarge} strokeWidth={UI_TOKENS.icons.strokeWidth} />
        </button>
        <p>Open a folder or drop FLAC files here to begin.</p>
      </div>
    {/if}
  </div>
</DropZone>

<style>
  .grid-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    background-color: var(--bg-main);
    user-select: none;
    min-height: 0;
  }

  .data-grid {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
  }

  .data-grid th {
    text-align: left;
    padding: 0.75rem 1rem;
    background-color: var(--bg-header);
    position: sticky;
    top: 0;
    color: var(--text-muted);
    text-transform: uppercase;
    font-size: 0.7rem;
    letter-spacing: 0.05rem;
    z-index: 10;
  }

  .col-indicator {
    width: 6px;
    padding: 0;
  }

  .col-track {
    width: 2.5rem;
    color: var(--text-dim) !important;
  }

  .track-row {
    border-bottom: 1px solid var(--bg-header);
    cursor: default;
    position: relative;
    transition: background-color 0.15s ease;
    scroll-margin-top: 2.5rem;
  }

  .track-row:hover {
    background-color: var(--bg-hover);
  }

  .track-row.selected {
    background-color: var(--selection-bg);
  }

  .indicator-cell {
    width: 4px;
    padding: 0;
    position: relative;
  }

  .indicator-cell::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 4px;
    background-color: var(--accent-primary);
    box-shadow: 2px 0 8px var(--selection-glow);
    opacity: 0;
    transition: all 0.1s ease;
    pointer-events: none;
  }

  .track-row.selected .indicator-cell::after,
  .track-row.modified .indicator-cell::after {
    opacity: 1;
  }

  .track-row.modified .indicator-cell::after {
    background-color: var(--accent-modified);
    box-shadow: 2px 0 8px var(--accent-modified-glow);
  }

  .track-row td {
    padding: 0.75rem 1rem;
    color: var(--text-secondary);
  }

  .track-row.modified td {
    font-weight: 600;
    color: var(--text-primary);
  }

  .track-cell {
    color: var(--text-muted) !important;
    font-family: 'JetBrains Mono', 'Roboto Mono', monospace;
    font-size: 0.8rem;
  }

  .empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--text-dim);
    gap: 1.5rem;
  }

  .empty-icon {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--bg-header);
    border-radius: var(--radius-xl);
    color: var(--text-muted);
    margin-bottom: 0.5rem;
    border: 1px solid var(--border-primary);
    /* パルスするグロー効果 */
    box-shadow: 0 0 15px var(--selection-glow);
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 0;
    outline: none;
  }

  .empty-icon:hover {
    animation: none;
    background-color: var(--bg-secondary);
    box-shadow: 0 0 25px var(--selection-glow);
    color: var(--text-primary);
    transform: translateY(-2px);
  }

  .empty-icon:active {
    transform: scale(0.95);
  }

  .empty-icon:focus-visible {
    border-color: var(--accent-primary);
    box-shadow: var(--focus-ring), var(--focus-glow);
  }

  .empty-state p {
    margin: 0;
    font-size: 1rem;
    opacity: 0.7;
    letter-spacing: 0.5px;
  }
</style>
