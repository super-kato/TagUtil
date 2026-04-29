<script lang="ts">
  import { Image as ImageIcon } from '@lucide/svelte';
  import { SUPPORTED_IMAGE_EXTENSIONS } from '@domain/file-extensions';
  import { trackStore } from '@renderer/stores/track-store.svelte';
  import { tagActions } from '@renderer/services/tag-actions';
  import ArtworkSection from './inspector/ArtworkSection.svelte';
  import BasicFields from './inspector/BasicFields.svelte';
  import GenreSection from './inspector/GenreSection.svelte';
  import NumericFields from './inspector/NumericFields.svelte';
  import TechnicalInfo from './inspector/TechnicalInfo.svelte';
  import DropZone from '@renderer/components/ui/DropZone.svelte';
  import DropZoneOverlay from '@renderer/components/ui/DropZoneOverlay.svelte';
  import { hasExtension } from '@shared/utils/file-filter';
  /** ドラッグ＆ドロップされたファイルから最初の画像を見つけて適用します */
  const handleArtworkDrop = (paths: string[]): void => {
    const imagePath = paths.find((p) => hasExtension(p, SUPPORTED_IMAGE_EXTENSIONS));
    if (!imagePath) {
      return;
    }

    tagActions.applyPictureFromPath(imagePath);
  };
</script>

<aside class="inspector no-focus-glow" tabindex="-1" data-testid="inspector">
  <DropZone testId="inspector-drop-zone" onDrop={handleArtworkDrop}>
    {#snippet overlay()}
      <DropZoneOverlay
        icon={ImageIcon}
        title="Drop to set Artwork"
        sub="Apply to selected tracks"
      />
    {/snippet}

    <div class="inspector-content">
      {#if trackStore.selectedTracks.length > 0}
        <ArtworkSection />

        <div class="field-container">
          <BasicFields />
          <NumericFields />
          <GenreSection />
          <TechnicalInfo />
        </div>
      {:else}
        <div class="empty-inspector" data-testid="inspector-empty">
          <p>Select tracks to edit metadata</p>
        </div>
      {/if}
    </div>
  </DropZone>
</aside>

<style>
  .inspector {
    width: 320px;
    min-width: 320px;
    background-color: var(--bg-inspector);
    display: flex;
    flex-direction: column;
    overflow-y: hidden;
  }

  .inspector-content {
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    overflow-y: auto;
    height: 100%;
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
