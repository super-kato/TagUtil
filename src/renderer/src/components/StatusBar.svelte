<script lang="ts">
  import { uiState } from '@renderer/stores/ui-state.svelte';
  import { logStore } from '@renderer/stores/log-store.svelte';
  import { CircleAlert, TriangleAlert, ChevronUp, ChevronDown, Info } from '@lucide/svelte';
  import { UI_TOKENS } from '@renderer/constants/design-system';

  let isExpanded = $state(false);

  const toggleExpand = (): void => {
    isExpanded = !isExpanded;
  };
</script>

<footer class="status-bar" class:expanded={isExpanded}>
  <div
    class="main-bar"
    onclick={toggleExpand}
    onkeydown={(e) => e.key === 'Enter' && toggleExpand()}
    role="button"
    tabindex="0"
    aria-label={isExpanded ? 'Collapse logs' : 'Expand logs'}
  >
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

    <div class="expand-icon">
      {#if isExpanded}
        <ChevronDown size={UI_TOKENS.icons.size} />
      {:else}
        <ChevronUp size={UI_TOKENS.icons.size} />
      {/if}
    </div>
  </div>

  {#if isExpanded}
    <div class="log-panel">
      <div class="log-list">
        {#each [...logStore.logs].reverse() as log (log.id)}
          <div class="log-entry {log.level}">
            <span class="log-time">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
            <span class="log-level-tag">{log.level.toUpperCase()}</span>
            <span class="log-text">{log.message}</span>
          </div>
        {/each}
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
    cursor: pointer;
    user-select: none;
    transition: background-color 0.2s ease;
  }

  .main-bar:hover {
    background-color: var(--bg-hover);
  }

  .main-bar:focus-visible {
    outline: 2px solid var(--accent-primary);
    outline-offset: -2px;
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

  .expand-icon {
    color: var(--text-dim);
    display: flex;
    align-items: center;
    padding: 0.25rem;
    border-radius: var(--radius-sm);
    transition: color 0.2s ease;
  }

  .main-bar:hover .expand-icon {
    color: var(--text-primary);
  }

  .log-panel {
    height: 15rem;
    display: flex;
    flex-direction: column;
    border-top: 1px solid var(--border-secondary);
    background-color: var(--bg-body);
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
</style>
