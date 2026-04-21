<script lang="ts">
  import type { Snippet } from 'svelte';
  import { uiState } from '@renderer/stores/ui-state.svelte';
  import { getAllPathsFromDropEvent } from '@renderer/infrastructure/file-drop-adapter';
  import { filterByExtensions } from '@shared/utils/file-filter';

  interface Props {
    children: Snippet;
    overlay: Snippet;
    onDrop: (paths: string[]) => void;
    accept?: readonly string[];
  }

  let { children, overlay, onDrop, accept = [] }: Props = $props();

  let isDragging = $state(false);

  const handleDragOver = (e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    isDragging = true;
  };

  const handleDragLeave = (e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
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

    let paths = getAllPathsFromDropEvent(e);

    if (accept.length > 0) {
      paths = filterByExtensions(paths, accept);
    }

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
      {@render overlay()}
    </div>
  {/if}
</div>

<style>
  .drop-zone-container {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
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
</style>
