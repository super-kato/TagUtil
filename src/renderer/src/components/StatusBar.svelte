<script lang="ts">
  import type { LogLevel } from '@domain/common/log';
  import { ChevronUp, CircleAlert, Info, TriangleAlert, type LucideProps } from '@lucide/svelte';
  import { UI_TOKENS } from '@renderer/constants/design-system';
  import { IS_MAC } from '@renderer/constants/platform';
  import { logStore } from '@renderer/stores/log-store.svelte';
  import { KeyboardHandler } from '@renderer/utils/keyboard-handler';
  import { formatLogTime } from '@shared/utils/date';
  import type { Component } from 'svelte';
  import { slide } from 'svelte/transition';

  let isExpanded = $state(false);

  const toggleExpand = (): void => {
    isExpanded = !isExpanded;
  };

  let logListElement: HTMLDivElement | undefined = $state();
  let isAtBottom = $state(true);

  const SCROLL_THRESHOLD_PX = 10;

  // DOM更新前に現在のスクロール位置が下端に近いか判定
  $effect.pre(() => {
    if (!logListElement || logStore.logs.length < 0) {
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = logListElement;
    // 下端付近にいるなら追従対象とする
    isAtBottom = scrollHeight - scrollTop - clientHeight < SCROLL_THRESHOLD_PX;
  });

  // ログが追加された後、下端にいた場合のみスクロールを追従させる
  $effect(() => {
    // 前提条件：要素が存在し、かつ展開されていること
    if (!logListElement || !isExpanded) {
      return;
    }

    // 実行条件：下端に位置しており、かつ表示するログが存在すること
    const shouldScroll = isAtBottom && logStore.logs.length > 0;
    if (!shouldScroll) {
      return;
    }

    logListElement.scrollTo({ top: logListElement.scrollHeight, behavior: 'smooth' });
  });

  const handler = new KeyboardHandler(IS_MAC, [{ combo: { key: 'Enter' }, handler: toggleExpand }]);

  const levelIcons: ReadonlyMap<LogLevel, Component<LucideProps>> = new Map([
    ['INFO', Info],
    ['WARN', TriangleAlert],
    ['ERROR', CircleAlert]
  ] as const);

  /** メインバーに表示する現在の状態 */
  const displayState = $derived(logStore.latestLog);
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
      {#if displayState}
        {@const ICON = levelIcons.get(displayState.level)}
        <div class="status-item {displayState.level.toLowerCase()}">
          {#if ICON}
            <ICON size={UI_TOKENS.icons.size} />
          {/if}
          <span class="log-message">{displayState.message}</span>
        </div>
      {:else}
        <div class="status-item ready">
          <span>Ready</span>
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
        {#each logStore.logs as log (log.id)}
          {@const ICON = levelIcons.get(log.level)}
          <div class="log-entry {log.level}">
            <span class="log-time">[{formatLogTime(log.timestamp)}]</span>
            <div class="log-level-icon">
              <ICON size={UI_TOKENS.icons.sizeSmall} />
            </div>
            <span class="log-text" title={log.message}>{log.message}</span>
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

  .status-item.warn {
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
    align-items: baseline;
    font-size: 0.7rem;
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

  .log-level-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .log-entry.info .log-level-icon {
    color: #4da6ff;
  }
  .log-entry.warn .log-level-icon {
    color: var(--accent-warning);
  }
  .log-entry.error .log-level-icon {
    color: var(--accent-error);
  }

  .log-text {
    color: var(--text-secondary);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    flex: 1;
  }
</style>
