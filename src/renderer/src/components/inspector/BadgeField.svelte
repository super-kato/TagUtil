<script lang="ts">
  import { X } from '@lucide/svelte';
  import { UI_TOKENS } from '@renderer/constants/design-system';

  interface Props {
    label: string;
    values: string[];
    isUniform: boolean;
    placeholder?: string;
    onAdd: (value: string) => void;
    onRemove: (value: string) => void;
  }

  let { label, values, isUniform, onAdd, onRemove }: Props = $props();

  let inputValue = $state('');

  const handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = inputValue.trim();
      if (val) {
        onAdd(val);
        inputValue = '';
      }
    } else if (e.key === 'Backspace' && inputValue === '' && values.length > 0) {
      // 入力欄が空の状態でバックスペースを押すと最後の項目を削除
      onRemove(values[values.length - 1]);
    }
  };

  const handleClickContainer = (e: MouseEvent): void => {
    // コンテナクリックで中の入力欄にフォーカスを当てる
    const target = e.target as HTMLElement;
    if (target.classList.contains('badge-container')) {
      const input = target.querySelector('input');
      input?.focus();
    }
  };
</script>

<div class="badge-field field">
  <label for="badge-input-{label}">{label}</label>

  <div
    class="badge-container"
    class:divergent={!isUniform}
    onclick={handleClickContainer}
    role="presentation"
  >
    {#if isUniform}
      {#each values as val, i (i)}
        <span class="badge">
          {val}
          <button
            type="button"
            class="remove-btn no-hover-glow"
            onclick={() => onRemove(val)}
            title="Remove"
          >
            <X size={UI_TOKENS.icons.sizeSmall} strokeWidth={UI_TOKENS.icons.strokeBold} />
          </button>
        </span>
      {/each}
      <input
        id="badge-input-{label}"
        type="text"
        bind:value={inputValue}
        onkeydown={handleKeyDown}
        autocomplete="off"
      />
    {:else}
      <div class="mixed-placeholder">Mixed Values (Click to unify)</div>
    {/if}
  </div>
</div>

<style>
  .badge-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    background-color: var(--bg-hover);
    border: 1px solid var(--border-primary);
    padding: 0.4rem;
    border-radius: var(--radius-md);
    min-height: 2.4rem;
    cursor: text;
    transition: all 0.2s ease;
  }

  .badge-container:focus-within {
    border-color: var(--accent-primary);
    background-color: var(--bg-secondary);
    box-shadow: var(--focus-ring), var(--focus-glow);
  }

  .badge-container.divergent {
    opacity: 0.6;
    background-color: var(--bg-header);
    cursor: pointer;
    justify-content: center;
    align-items: center;
    font-style: italic;
    color: var(--text-muted);
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    background-color: var(--border-primary);
    color: var(--text-primary);
    padding: 0.2rem 0.5rem;
    border-radius: var(--radius-sm);
    font-size: 0.8rem;
    border: 1px solid var(--border-secondary);
    animation: badge-in 0.2s ease-out;
  }

  @keyframes badge-in {
    from {
      transform: scale(0.9);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  .remove-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: none;
    color: var(--text-dim);
    cursor: pointer;
    padding: 0;
    margin-left: 0.1rem;
    transition: all 0.2s;
    opacity: 0;
    pointer-events: none;
  }

  .badge:hover .remove-btn,
  .badge:focus-within .remove-btn {
    opacity: 0.8;
    pointer-events: auto;
  }

  .remove-btn:hover,
  .remove-btn:focus-visible {
    color: var(--accent-modified);
    opacity: 1 !important;
  }

  .badge-container input {
    flex: 1;
    min-width: 60px;
    background: transparent;
    border: none;
    color: var(--text-primary);
    font-size: 0.85rem;
    padding: 0.1rem 0.2rem;
    outline: none;
  }

  .badge-container input::placeholder {
    color: var(--text-dim);
  }
</style>
