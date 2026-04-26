<script lang="ts">
  import { DEFAULT_GENRES } from '@domain/flac/constants';
  import { trackStore } from '@renderer/stores/track-store.svelte';
  import { tagActions } from '@renderer/services/tag-actions';
  import BadgeField from '@renderer/components/ui/BadgeField.svelte';
  import { getMultiFieldValues } from './tag-field-handlers';

  const MAX_QUICK_GENRES = 4;
  const QUICK_GENRES = DEFAULT_GENRES.slice(0, MAX_QUICK_GENRES);

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
      suggestions={trackStore.allGenres}
      onAdd={(v) => applyGenre(v)}
      onRemove={(v) => tagActions.removeSelectedMultiFieldValue('genre', v)}
    />

    <div class="quick-genres">
      {#each QUICK_GENRES as g (g)}
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
