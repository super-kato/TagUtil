<script lang="ts">
  import { X, ChevronDown } from '@lucide/svelte';
  import { UI_TOKENS } from '@renderer/constants/design-system';
  import { IS_MAC } from '@renderer/infrastructure/adapters/platform-adapter';
  import { KeyboardHandler } from '@renderer/utils/keyboard-handler';

  interface Props {
    label?: string;
    values: string[];
    isUniform: boolean;
    suggestions?: string[];
    onAdd: (value: string) => void;
    onRemove: (value: string) => void;
  }

  let { label = '', values, isUniform, suggestions = [], onAdd, onRemove }: Props = $props();

  let inputValue = $state('');
  let inputElement: HTMLInputElement | undefined = $state();

  const filteredSuggestions = $derived(suggestions.filter((s) => !values.includes(s)));

  const handleAdd = (): void => {
    const val = inputValue.trim();
    if (!val) {
      return;
    }

    onAdd(val);
    inputValue = '';
  };

  const handleBackspace = (): void => {
    if (inputValue !== '' || values.length === 0) {
      return;
    }

    const lastValue = values[values.length - 1];
    if (lastValue === undefined) {
      return;
    }

    onRemove(lastValue);
  };

  const handler = new KeyboardHandler(IS_MAC, [
    { combo: { key: 'Enter' }, handler: handleAdd, preventDefault: true },
    { combo: { key: ',' }, handler: handleAdd, preventDefault: true },
    { combo: { key: 'Backspace' }, handler: handleBackspace }
  ]);

  const handleClickContainer = (e: MouseEvent): void => {
    const target = e.target as HTMLElement;
    if (!target.classList.contains('badge-container')) {
      return;
    }

    inputElement?.focus();
  };
</script>

<div class="badge-field field" data-testid="{label.toLowerCase().replace(/\s+/g, '-')}-field">
  {#if label}
    <label for="badge-input-{label}">{label}</label>
  {/if}

  <div
    class="badge-container"
    class:divergent={!isUniform}
    onclick={handleClickContainer}
    role="presentation"
  >
    {#each values as val, i (i)}
      <span class="badge" class:divergent-badge={!isUniform} data-testid="badge-item">
        {val}
        <button
          type="button"
          class="remove-btn no-hover-glow"
          onclick={() => onRemove(val)}
          title={isUniform ? 'Remove' : 'Remove from all tracks'}
        >
          <X size={UI_TOKENS.icons.sizeSmall} strokeWidth={UI_TOKENS.icons.strokeBold} />
        </button>
      </span>
    {/each}
    <div class="input-wrapper">
      <input
        id="badge-input-{label}"
        type="text"
        list="suggestions-{label}"
        bind:this={inputElement}
        bind:value={inputValue}
        onkeydown={(e) => handler.handle(e)}
        autocomplete="off"
        placeholder={!isUniform && values.length === 0 ? 'Mixed Values' : ''}
      />
      <div class="dropdown-indicator">
        <ChevronDown size={UI_TOKENS.icons.sizeSmall} strokeWidth={UI_TOKENS.icons.strokeBold} />
      </div>

      <datalist id="suggestions-{label}">
        {#each filteredSuggestions as suggestion (suggestion)}
          <option value={suggestion}></option>
        {/each}
      </datalist>
    </div>
  </div>
</div>

<style>
  .badge-container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.4rem;
    background-color: var(--bg-hover);
    border: 1px solid var(--border-primary);
    padding: 0.3rem 0.5rem;
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
    background-color: var(--bg-header);
    cursor: text;
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

  .badge.divergent-badge {
    opacity: 0.8;
    border-style: dashed;
    font-style: italic;
    color: var(--text-dim);
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

  .input-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    position: relative;
    min-width: 120px;
  }

  .badge-container input {
    width: 100%;
    background: transparent;
    border: none;
    color: var(--text-primary);
    font-size: 0.85rem;
    padding: 0.2rem 1.5rem 0.2rem 0.2rem;
    outline: none;
    box-shadow: none !important;
  }

  /* datalistのデフォルトインジケーターを無効化 */
  .badge-container input::-webkit-calendar-picker-indicator {
    position: absolute;
    right: 0;
    top: 0;
    width: 1.5rem;
    height: 100%;
    margin: 0;
    padding: 0;
    opacity: 0;
    cursor: pointer;
    z-index: 2;
  }

  .dropdown-indicator {
    position: absolute;
    right: 0.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-dim);
    pointer-events: none;
    transition: color 0.2s;
    z-index: 1;
  }

  .badge-container:focus-within .dropdown-indicator {
    color: var(--accent-primary);
  }

  .badge-container input::placeholder {
    color: var(--text-dim);
  }
</style>
