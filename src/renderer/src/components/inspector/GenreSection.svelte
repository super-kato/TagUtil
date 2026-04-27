<script lang="ts">
  import BadgeField from '@renderer/components/ui/BadgeField.svelte';
  import { tagActions } from '@renderer/services/tag-actions';
  import { settingsStore } from '@renderer/stores/settings-store.svelte';
  import { trackStore } from '@renderer/stores/track-store.svelte';
  import { getMultiFieldValues } from './tag-field-handlers';

  const quickGenres = $derived(settingsStore.current?.quickGenres ?? []);
  const allGenreSuggestions = $derived.by(() => {
    const settingsGenres = settingsStore.current?.genres ?? [];
    const trackGenres = trackStore.allGenres;
    return [...new Set([...settingsGenres, ...trackGenres])].sort();
  });

  const applyGenre = (genre: string): void => {
    const trimmed = genre.trim();
    if (trimmed) {
      tagActions.addSelectedMultiFieldValue('genre', trimmed);
    }
  };
</script>

{#if trackStore.commonMetadata}
  {@const commonMetadata = trackStore.commonMetadata}
  {@const genreState = commonMetadata.genre}
  <div class="genre-section">
    <BadgeField
      label="Genre"
      values={getMultiFieldValues(genreState)}
      isUniform={genreState.type === 'uniform'}
      suggestions={allGenreSuggestions}
      onAdd={(v) => applyGenre(v)}
      onRemove={(v) => tagActions.removeSelectedMultiFieldValue('genre', v)}
    />

    <div class="quick-genres">
      {#each quickGenres as g (g)}
        <button class="genre-badge" onclick={() => applyGenre(g)}>
          {g}
        </button>
      {/each}
    </div>
  </div>
{/if}

<style>
  .genre-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .quick-genres {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .genre-badge {
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-full);
    background: var(--bg-secondary);
    border: 1px solid var(--border-primary);
    font-size: 0.75rem;
    color: var(--text-dim);
    cursor: pointer;
    transition: all 0.2s;
  }

  .genre-badge:hover {
    background: var(--bg-hover);
    color: var(--accent-primary);
    border-color: var(--accent-primary);
  }
</style>
