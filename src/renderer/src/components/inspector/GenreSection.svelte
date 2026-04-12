<script lang="ts">
  import { DEFAULT_GENRES } from '@domain/flac/types';
  import { tagState } from '../../stores/tag-state.svelte';
  import BadgeField from './BadgeField.svelte';

  const MAX_QUICK_GENRES = 4;
  const QUICK_GENRES = DEFAULT_GENRES.slice(0, MAX_QUICK_GENRES);

  const applyGenre = (genre: string): void => {
    const trimmed = genre.trim();
    if (trimmed) {
      tagState.addSelectedMultiFieldValue('genre', trimmed);
    }
  };
</script>

{#if tagState.commonMetadata}
  {@const commonMetadata = tagState.commonMetadata}
  {@const genreState = commonMetadata.genre}
  <div class="genre-section">
    <BadgeField
      label="Genre"
      values={genreState.type === 'uniform' ? (genreState.value ?? []) : []}
      isUniform={genreState.type === 'uniform'}
      onAdd={(v) => applyGenre(v)}
      onRemove={(i) => tagState.removeSelectedMultiFieldValue('genre', i)}
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
    border: 1px solid var(--border-color);
    font-size: 0.75rem;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.2s;
  }

  .genre-badge:hover {
    background: var(--bg-hover);
    color: var(--accent-primary);
    border-color: var(--accent-primary);
  }
</style>
