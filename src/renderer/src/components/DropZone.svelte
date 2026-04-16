<script lang="ts">
  import { FolderOpen } from 'lucide-svelte';
  import type { Snippet } from 'svelte';
  import { UI_TOKENS } from '../constants/design-system';
  import { uiState } from '../stores/ui-state.svelte';
  import { getAllPathsFromDropEvent } from '../utils/drag-drop';

  interface Props {
    children: Snippet;
    onDrop: (paths: string[]) => void;
  }

  let { children, onDrop }: Props = $props();

  let isDragging = $state(false);

  const handleDragOver = (e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    isDragging = true;
  };

  const handleDragLeave = (e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    // 子要素への移動ではリセットしない (本当のコンテナ外脱出のみ判定)
    const container = e.currentTarget as HTMLElement;
    const related = e.relatedTarget as Node | null;
    if (!related || !container.contains(related)) {
      isDragging = false;
    }
  };

  const handleDrop = async (e: DragEvent): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();
    isDragging = false;

    if (uiState.isLoading) {
      return;
    }

    const paths = getAllPathsFromDropEvent(e);
    if (paths.length > 0) {
      onDrop(paths);
    }
  };
</script>

<div
  class="drop-zone-container"
  ondragover={handleDragOver}
  ondragleave={handleDragLeave}
  ondrop={handleDrop}
  role="region"
  aria-label="File drop zone"
>
  {@render children()}

  {#if isDragging}
    <div class="drop-overlay">
      <div class="drop-content">
        <div class="icon-wrapper">
          <FolderOpen size={UI_TOKENS.icons.sizeLarge} strokeWidth={1} />
        </div>
        <h2>Drop to scan FLAC files</h2>
        <p>Release to open</p>
      </div>
    </div>
  {/if}
</div>

<style>
  .drop-zone-container {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }

  .drop-overlay {
    position: absolute;
    inset: 0;
    z-index: 1000;
    background-color: var(--bg-overlay);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px dashed var(--accent-primary);
    margin: 12px;
    border-radius: var(--radius-2xl);
    pointer-events: none;
    animation: fadeIn 0.15s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.98);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .drop-content {
    text-align: center;
    color: var(--accent-primary);
  }

  .drop-content h2 {
    font-size: 1.5rem;
    margin: 1rem 0 0.5rem;
    font-weight: 600;
  }

  .drop-content p {
    color: var(--text-muted);
    font-size: 1rem;
  }

  .icon-wrapper {
    background: var(--accent-primary-dim);
    color: var(--accent-primary);
    width: 96px;
    height: 96px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
  }
</style>
