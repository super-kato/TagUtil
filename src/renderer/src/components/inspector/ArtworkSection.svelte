<script lang="ts">
  import { UI_TOKENS } from '@renderer/constants/design-system';
  import { Image as ImageIcon, Music, X } from '@lucide/svelte';
  import { SUPPORTED_IMAGE_EXTENSIONS } from '@domain/file-extensions';
  import { tagActions } from '../../services/tag-actions';
  import { trackStore } from '../../stores/track-store.svelte';
  import DropZone from '../DropZone.svelte';
  import DropZoneOverlay from '../DropZoneOverlay.svelte';

  let imageLoadError = $state(false);

  // URLが変わるたびにエラー状態をリセットする
  $effect(() => {
    if (trackStore.commonImageUrl) {
      imageLoadError = false;
    }
  });

  const handleRemoveArtwork = (e: MouseEvent): void => {
    e.stopPropagation();
    tagActions.removeArtwork();
  };

  /** 表示するプレースホルダーテキストを返します */
  const getPlaceholderText = (): string => {
    if (imageLoadError) {
      return 'Load Error';
    }
    if (trackStore.commonMetadata?.picture.type === 'divergent') {
      return 'Mixed Artworks';
    }
    return 'No Artwork';
  };
</script>

<div class="artwork-container">
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
    <div
      class="artwork-section"
      onclick={() => tagActions.pickAndApplyPicture()}
      onkeydown={(e) => e.key === 'Enter' && tagActions.pickAndApplyPicture()}
      role="button"
      tabindex="0"
      title="Click to change artwork"
    >
      {#if trackStore.commonImageUrl}
        <img
          src={trackStore.commonImageUrl}
          alt="Cover Art"
          class="cover-art"
          class:hidden={imageLoadError}
          onerror={() => (imageLoadError = true)}
          onload={() => (imageLoadError = false)}
        />
        {#if !imageLoadError}
          <button class="remove-artwork" onclick={handleRemoveArtwork} title="Remove Artwork">
            <X size={UI_TOKENS.icons.size} />
          </button>
        {/if}
      {/if}

      {#if !trackStore.commonImageUrl || imageLoadError}
        <div
          class="cover-placeholder"
          class:error={imageLoadError}
          class:mixed={trackStore.commonMetadata?.picture.type === 'divergent'}
        >
          <div class="icon-wrapper">
            <Music size={UI_TOKENS.icons.sizeLarge} strokeWidth={UI_TOKENS.icons.strokeWidth} />
          </div>
          <span class="text">{getPlaceholderText()}</span>
        </div>
      {/if}

      <div class="art-overlay">
        <span>Change Artwork</span>
      </div>
    </div>
  </DropZone>
</div>

<style>
  .artwork-container {
    width: 90%;
    margin: 0 auto 2rem auto;
    flex-shrink: 0;
  }

  .artwork-section {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: var(--radius-xl);
    overflow: hidden;
    position: relative;
    cursor: pointer;
    background-color: var(--bg-hover);
    border: 1px solid var(--border-primary);
    padding: 1px;
    display: grid;
    place-items: center;
  }

  .cover-art,
  .cover-placeholder,
  .art-overlay {
    grid-area: 1 / 1;
    width: 100%;
    height: 100%;
  }

  .cover-art {
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .cover-art.hidden {
    display: none;
  }

  .art-overlay {
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
    backdrop-filter: blur(2px);
    z-index: 5;
  }

  .artwork-section:hover .art-overlay {
    opacity: 1;
  }

  .art-overlay span {
    color: white;
    font-size: 0.8rem;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
    background: rgba(0, 0, 0, 0.4);
    padding: 0.5rem 1rem;
    border-radius: var(--radius-2xl);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .remove-artwork {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 24px;
    height: 24px;
    border-radius: var(--radius-full);
    background: rgba(0, 0, 0, 0.6);
    color: white;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    cursor: pointer;
    z-index: 10;
    opacity: 0.8;
    transition: all 0.2s;
  }

  .remove-artwork:hover {
    background: var(--accent-modified);
    opacity: 1;
    transform: scale(1.1);
  }

  .cover-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--text-dim);
    border: 2px dashed var(--border-primary);
    border-radius: var(--radius-xl);
  }

  .cover-placeholder.error {
    color: var(--accent-error);
    border-color: var(--accent-error);
  }

  .cover-placeholder.mixed {
    color: var(--accent-warning);
    border-color: var(--accent-warning);
  }

  .cover-placeholder .text {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
</style>
