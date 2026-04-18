<script lang="ts">
  import { selectionState } from '../stores/selection-state.svelte';
  import { TrackRecord } from '../stores/track-record.svelte';
  import { trackStore } from '../stores/track-store.svelte';

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

<div class="grid-wrapper">
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
        {#each trackStore.tracks as track, i (track.path)}
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
      <p>Click "Open Folder" to start tagging your FLAC files.</p>
    </div>
  {/if}
</div>

<style>
  .grid-wrapper {
    flex: 1;
    overflow-y: auto;
    background-color: var(--bg-main);
    user-select: none;
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

  .track-row.selected .indicator-cell::after,
  .track-row.modified .indicator-cell::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 4px;
    background-color: var(--accent-primary);
    box-shadow: 2px 0 8px var(--selection-glow);
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
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-dim);
  }
</style>
