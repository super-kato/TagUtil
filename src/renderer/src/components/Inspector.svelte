<script lang="ts">
  import { Image as ImageIcon } from '@lucide/svelte';
  import { SUPPORTED_IMAGE_EXTENSIONS } from '@domain/file-extensions';
  import { trackStore } from '@stores/track-store.svelte';
  import { tagActions } from '@services/tag-actions';
  import ArtworkSection from './inspector/ArtworkSection.svelte';
  import BasicFields from './inspector/BasicFields.svelte';
  import GenreSection from './inspector/GenreSection.svelte';
  import NumericFields from './inspector/NumericFields.svelte';
  import TechnicalInfo from './inspector/TechnicalInfo.svelte';
  import DropZone from './DropZone.svelte';
  import DropZoneOverlay from './DropZoneOverlay.svelte';
</script>

<aside class="inspector">
  <DropZone
    accept={SUPPORTED_IMAGE_EXTENSIONS}
    onDrop={(paths) => tagActions.applyPictureFromPath(paths[0])}
  >
    {#snippet overlay()}
      <DropZoneOverlay
        icon={ImageIcon}
        title="Drop to set Artwork"
        sub="Apply to selected tracks"
      />
    {/snippet}

    {#if trackStore.selectedTracks.length > 0}
      <ArtworkSection />

      <div class="field-container">
        <BasicFields />
        <NumericFields />
        <GenreSection />
        <TechnicalInfo />
      </div>
    {:else}
      <div class="empty-inspector">
        <p>Select tracks to edit metadata</p>
      </div>
    {/if}
  </DropZone>
</aside>

<style>
  .inspector {
    width: 320px;
    background-color: var(--bg-inspector);
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    overflow-y: auto;
  }

  .field-container {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .empty-inspector {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: var(--text-dim);
    font-size: 0.9rem;
  }
</style>
