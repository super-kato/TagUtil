<script lang="ts">
  import { uiState } from '@renderer/stores/ui-state.svelte';
  import { logStore } from '@renderer/stores/log-store.svelte';
  import { CircleAlert, TriangleAlert, ChevronUp, ChevronDown, Info, Trash2 } from '@lucide/svelte';
  import { UI_TOKENS } from '@renderer/constants/design-system';

  let isExpanded = $state(false);

  const toggleExpand = (): void => {
    isExpanded = !isExpanded;
  };
</script>

<footer class="status-bar" class:expanded={isExpanded}>
  <div class="main-bar">
    <div class="status-content">
      {#if uiState.error}
        <div class="status-item error">
          <CircleAlert size={UI_TOKENS.icons.size} />
          <span>{uiState.error}</span>
        </div>
      {:else if uiState.isScanLimited}
        <div class="status-item warning">
          <TriangleAlert size={UI_TOKENS.icons.size} />
          <span>Scan limit (500 items) reached. Some files were skipped.</span>
        </div>
      {:else if logStore.latestLog}
        <div class="status-item info">
          <Info size={UI_TOKENS.icons.size} />
          <span class="log-message">{logStore.latestLog.message}</span>
        </div>
      {:else}
        <div class="status-item ready">
          <span>Ready</span>
        </div>
      {/if}
    </div>

    <button
      class="expand-button"
      onclick={toggleExpand}
      aria-label={isExpanded ? 'Collapse logs' : 'Expand logs'}
    >
      {#if isExpanded}
        <ChevronDown size={UI_TOKENS.icons.size} />
      {:else}
        <ChevronUp size={UI_TOKENS.icons.size} />
      {/if}
    </button>
  </div>

  {#if isExpanded}
    <div class="log-panel">
      <div class="log-header">
        <span>History ({logStore.logs.length} / 100)</span>
        <button class="clear-button" onclick={() => logStore.clear()} title="Clear logs">
          <Trash2 size={UI_TOKENS.icons.size} />
          <span>Clear</span>
        </button>
      </div>
      <div class="log-list">
        {#each [...logStore.logs].reverse() as log (log.timestamp)}
          <div class="log-entry {log.level}">
            <span class="log-time">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
            <span class="log-level-tag">{log.level.toUpperCase()}</span>
            <span class="log-text">{log.message}</span>
          </div>
        {/each}
        {#if logStore.logs.length === 0}
          <div class="log-empty">No log history</div>
        {/if}
      </div>
    </div>
  {/if}
</footer>

<style>
  .status-bar {
    background-color: var(--bg-body);
    border-top: 1px solid var(--border-primary);
    color: var(--text-secondary);
    display: flex;
    flex-direction: column;
    width: 100%;
    z-index: 100;
  }

  .main-bar {
    height: 2.25rem;
    display: flex;
    align-items: center;
    padding: 0 0.75rem;
    gap: 1rem;
    background-color: var(--bg-header);
  }

  .status-content {
    flex: 1;
    overflow: hidden;
  }

  .status-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .status-item.error {
    color: var(--accent-error);
    font-weight: 600;
  }

  .status-item.warning {
    color: var(--accent-warning);
    font-weight: 500;
  }

  .status-item.ready {
    color: var(--text-muted);
  }

  .log-message {
    color: var(--text-primary);
  }

  .expand-button {
    background: none;
    border: none;
    color: var(--text-dim);
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0.25rem;
    border-radius: var(--radius-sm);
    transition: all 0.2s ease;
  }

  .expand-button:hover {
    background-color: var(--bg-hover);
    color: var(--text-primary);
  }

  .log-panel {
    height: 15rem;
    display: flex;
    flex-direction: column;
    border-top: 1px solid var(--border-secondary);
    background-color: var(--bg-body);
  }

  .log-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.4rem 0.75rem;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background-color: var(--bg-secondary);
    color: var(--text-dim);
    border-bottom: 1px solid var(--border-primary);
  }

  .clear-button {
    background: none;
    border: none;
    color: var(--text-dim);
    cursor: pointer;
    font-size: 0.7rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.2rem 0.4rem;
    border-radius: var(--radius-sm);
  }

  .clear-button:hover {
    background-color: var(--bg-hover);
    color: var(--accent-error);
  }

  .log-list {
    flex: 1;
    overflow-y: auto;
    padding: 0.5rem;
    font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
    font-size: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
  }

  .log-entry {
    display: flex;
    gap: 0.75rem;
    line-height: 1.5;
    padding: 0.1rem 0.4rem;
    border-radius: 2px;
  }

  .log-entry:hover {
    background-color: var(--bg-hover);
  }

  .log-time {
    color: var(--text-dim);
    flex-shrink: 0;
    font-variant-numeric: tabular-nums;
  }

  .log-level-tag {
    font-weight: 700;
    width: 3.5rem;
    flex-shrink: 0;
  }

  .log-entry.info .log-level-tag {
    color: #4da6ff;
  }
  .log-entry.warn .log-level-tag {
    color: var(--accent-warning);
  }
  .log-entry.error .log-level-tag {
    color: var(--accent-error);
  }

  .log-text {
    color: var(--text-secondary);
    word-break: break-all;
  }

  .log-empty {
    padding: 3rem;
    text-align: center;
    color: var(--text-dim);
    font-style: italic;
  }
</style>
