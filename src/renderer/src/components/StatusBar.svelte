<script lang="ts">
  import type { LogLevel } from '@domain/common/log';
  import { Check, ChevronUp, List, TriangleAlert, X, type LucideProps } from '@lucide/svelte';
  import { tooltip } from '@renderer/actions/tooltip';
  import { UI_TOKENS } from '@renderer/constants/design-system';
  import { IS_MAC } from '@renderer/infrastructure/adapters/platform-adapter';
  import { logStore } from '@renderer/stores/log-store.svelte';
  import { KeyboardHandler } from '@renderer/utils/keyboard-handler';
  import { formatTimeWithMs } from '@shared/utils/date';
  import { type Component } from 'svelte';
  import { slide } from 'svelte/transition';

  const levelIcons: ReadonlyMap<LogLevel, Component<LucideProps>> = new Map([
    ['INFO', Check],
    ['WARN', TriangleAlert],
    ['ERROR', X]
  ] as const);

  let isExpanded = $state(true);
  let logListElement: HTMLDivElement | undefined = $state();

  const toggleExpand = (): void => {
    isExpanded = !isExpanded;
  };

  const handler = new KeyboardHandler(IS_MAC, [{ combo: { key: 'Enter' }, handler: toggleExpand }]);

  /** メインバーに表示する現在の状態 */
  const displayState = $derived(logStore.latestLog);

  // ログが追加された後、スクロールを追従させる
  $effect(() => {
    // 前提条件：要素が存在し、かつ展開されていること
    if (!logListElement || !isExpanded) {
      return;
    }

    // 実行条件：表示するログが存在しない場合は終了
    if (logStore.logs.length === 0) {
      return;
    }

    logListElement.scrollTo({ top: logListElement.scrollHeight, behavior: 'smooth' });
  });
</script>

<footer class="status-bar" class:expanded={isExpanded}>
  <div
    class="main-bar"
    onclick={toggleExpand}
    onkeydown={(e) => handler.handle(e)}
    role="button"
    tabindex="0"
    aria-label={isExpanded ? 'Collapse logs' : 'Expand logs'}
  >
    <div class="status-content">
      {#if isExpanded}
        <div class="status-item logs-title">
          <List size={UI_TOKENS.icons.size} />
          <span>Activity Log</span>
        </div>
      {:else if displayState}
        {@const ICON = levelIcons.get(displayState.level)}
        <div class="status-item {displayState.level.toLowerCase()}">
          {#if ICON}
            <ICON size={UI_TOKENS.icons.size} />
          {/if}
          <span class="log-message">
            <span class="log-context">[{displayState.context}]</span>
            {displayState.message}
          </span>
        </div>
      {/if}
    </div>

    <div class="expand-icon" class:is-expanded={isExpanded}>
      <ChevronUp size={UI_TOKENS.icons.size} />
    </div>
  </div>

  {#if isExpanded}
    <div class="log-panel" transition:slide={{ duration: 300 }}>
      <div class="log-list" bind:this={logListElement}>
        <table class="log-table">
          <tbody>
            {#each logStore.logs as log (log.id)}
              {@const ICON = levelIcons.get(log.level)}
              <tr class="log-entry {log.level.toLowerCase()}">
                <td class="log-col-time">
                  <span class="timestamp">[{formatTimeWithMs(log.timestamp)}]</span>
                </td>
                <td class="log-col-icon">
                  <div class="log-level-icon">
                    {#if ICON}
                      <ICON size={UI_TOKENS.icons.sizeSmall} />
                    {/if}
                  </div>
                </td>
                <td class="log-col-context">
                  <span class="log-context" use:tooltip={log.context}>[{log.context}]</span>
                </td>
                <td class="log-col-message">
                  <span class="log-text" use:tooltip={log.message}>
                    {log.message}
                  </span>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
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
  }

  .status-item.warn {
    color: var(--accent-warning);
  }

  .status-item.logs-title {
    color: var(--text-muted);
  }

  .status-item.error .log-message,
  .status-item.warn .log-message,
  .status-item.error .log-context,
  .status-item.warn .log-context {
    color: inherit;
  }

  .log-message {
    color: var(--text-primary);
  }

  .log-context {
    color: var(--text-muted);
    font-weight: 500;
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: bottom;
  }

  .expand-icon {
    color: var(--text-muted);
    display: flex;
    align-items: center;
    padding: 0.25rem;
    border-radius: var(--radius-sm);
    transition: all 0.3s ease;
  }

  .expand-icon.is-expanded {
    transform: rotate(180deg);
  }

  .main-bar:hover .expand-icon {
    color: var(--accent-primary);
    filter: drop-shadow(0 0 5px var(--selection-glow));
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
    overflow: auto;
    padding: 0.25rem 0.5rem;
    font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
    font-size: 0.75rem;
  }

  .log-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }

  .log-entry {
    font-size: 0.7rem;
    line-height: 1.5;
    transition: background-color 0.2s ease;
  }

  .log-entry:hover {
    background-color: var(--bg-hover);
  }

  .log-entry.warn:hover {
    background-color: var(--accent-warning-hover);
  }

  .log-entry.error:hover {
    background-color: var(--accent-error-hover);
  }

  .log-col-time {
    width: 6.2rem;
    padding: 0.15rem 0.4rem;
    color: var(--text-dim);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .log-col-icon {
    width: 1.2rem;
    padding: 0.15rem 0;
    text-align: center;
  }

  .log-col-context {
    width: 8rem;
    padding: 0.15rem 0.4rem;
    white-space: nowrap;
  }

  .log-col-message {
    padding: 0.15rem 0.4rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .log-level-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .log-entry.warn {
    background-color: var(--accent-warning-dim);
    color: var(--accent-warning);
  }

  .log-entry.error {
    background-color: var(--accent-error-dim);
    color: var(--accent-error);
  }

  .log-entry.warn td,
  .log-entry.error td {
    color: inherit;
  }

  .log-text {
    color: var(--text-secondary);
  }
</style>
