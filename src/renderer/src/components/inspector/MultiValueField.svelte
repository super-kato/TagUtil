<script lang="ts">
  import { Plus, X } from 'lucide-svelte';
  import type { Snippet } from 'svelte';
  import { UI_TOKENS } from '../../constants/design-system';

  interface Props {
    label: string;
    values: string[];
    isUniform: boolean;
    placeholder?: string;
    children?: Snippet;
    onUpdate: (index: number, value: string) => void;
    onAdd: () => void;
    onRemove: (index: number) => void;
  }

  let { label, values, isUniform, placeholder, children, onUpdate, onAdd, onRemove }: Props =
    $props();

  const handleUpdate = (index: number, e: Event): void => {
    const input = e.target as HTMLInputElement;
    onUpdate(index, input.value);
  };
</script>

<div class="multi-value-field field">
  <div class="field-header">
    <label for="multi-field-{label}">{label}</label>
    {#if isUniform}
      <button type="button" class="icon-button add-button" onclick={onAdd} title="Add value">
        <Plus size={UI_TOKENS.icons.size} />
      </button>
    {/if}
  </div>

  <div class="values-list">
    {#if !isUniform}
      <div class="divergent-placeholder">
        {#if children}
          {@render children()}
        {:else}
          <input type="text" value="" placeholder="Mixed Values" disabled class="disabled" />
        {/if}
      </div>
    {:else if values.length === 0}
      <div class="empty-placeholder">
        {#if children}
          {@render children()}
        {:else}
          Click + to add.
        {/if}
      </div>
    {:else}
      {#each values as value, i (i)}
        <div class="value-row">
          <input
            id={i === 0 ? `multi-field-${label}` : undefined}
            type="text"
            {value}
            placeholder={i === 0 && children ? '' : placeholder}
            oninput={(e) => handleUpdate(i, e)}
          />
          <button
            type="button"
            class="icon-button remove-button"
            onclick={() => onRemove(i)}
            title="Remove value"
          >
            <X size={UI_TOKENS.icons.size} />
          </button>
        </div>
      {/each}
    {/if}
  </div>
</div>

<style>
  .multi-value-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  /* .field label スタイルとの競合を避けつつレイアウトを維持 */
  .field-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.1rem;
  }

  .values-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .value-row {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  input {
    flex: 1;
  }

  .icon-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.3rem;
    border-radius: var(--radius-sm);
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.2s;
    opacity: 0.7;
  }

  .icon-button:hover {
    color: var(--accent-primary);
    opacity: 1;
  }

  .add-button {
    color: var(--text-secondary);
    padding: 0.2rem 0.5rem;
    opacity: 1;
  }

  .add-button:hover {
    color: var(--accent-primary);
  }

  /* 削除ボタンは行のホバー時のみ表示 */
  .remove-button {
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s;
  }

  .value-row:hover .remove-button {
    opacity: 0.8;
    pointer-events: auto;
  }

  .remove-button:hover {
    color: var(--accent-modified);
    opacity: 1 !important;
  }

  .divergent-placeholder input {
    font-size: 0.75rem;
    font-style: italic;
    color: #666;
  }

  .empty-placeholder {
    font-size: 0.75rem;
    color: #666;
    font-style: italic;
    padding: 0.5rem;
    border: 1px dashed var(--border-primary);
    border-radius: var(--radius-md);
    text-align: center;
    pointer-events: none;
    user-select: none;
  }
</style>
