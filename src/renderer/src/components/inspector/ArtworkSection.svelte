<script lang="ts">
  import { UI_TOKENS } from '@renderer/constants/design-system';
  import { Music, X } from 'lucide-svelte';
  import { tagState } from '../../stores/tag-state.svelte';

  let imageLoadError = $state(false);

  const handleRemoveArtwork = (e: MouseEvent): void => {
    e.stopPropagation();
    tagState.removeArtwork();
  };

  /** 表示するプレースホルダーテキストを返します */
  const getPlaceholderText = (): string => {
    if (imageLoadError) {
      return 'Load Error';
    }
    if (tagState.commonMetadata?.picture.type === 'divergent') {
      return 'Mixed Artworks';
    }
    return 'No Artwork';
  };
</script>

<div
  class="artwork-section"
  onclick={() => tagState.pickAndApplyPicture()}
  onkeydown={(e) => e.key === 'Enter' && tagState.pickAndApplyPicture()}
  role="button"
  tabindex="0"
  title="Click to change artwork"
>
  {#if tagState.commonImageUrl}
    <img
      src={tagState.commonImageUrl}
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

  {#if !tagState.commonImageUrl || imageLoadError}
    <div
      class="cover-placeholder"
      class:error={imageLoadError}
      class:mixed={tagState.commonMetadata?.picture.type === 'divergent'}
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

<style>
  .artwork-section {
    width: 90%;
    aspect-ratio: 1 / 1;
    flex-shrink: 0;
    margin: 0 auto 2rem auto;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    background-color: #2a2a2a;
    border: 1px solid #333;
    padding: 1px;
  }

  .cover-art {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .cover-art.hidden {
    display: none;
  }

  .art-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
    backdrop-filter: blur(2px);
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
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .remove-artwork {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
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
    background: #ff3b30;
    opacity: 1;
    transform: scale(1.1);
  }

  .cover-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #444;
    border: 2px dashed #333;
    border-radius: 12px;
  }

  .cover-placeholder.error {
    color: #ff3b30;
    border-color: #ff3b30;
  }

  .cover-placeholder.mixed {
    color: #ff9f0a;
    border-color: #ff9f0a;
  }

  .cover-placeholder .text {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
</style>
