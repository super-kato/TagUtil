<script lang="ts">
  import { trackStore } from '@renderer/stores/track-store.svelte';
  import { tooltip } from '@renderer/utils/tooltip';

  const formatHz = (hz: number | undefined): string => {
    if (hz === undefined) {
      return '-';
    }
    return hz.toLocaleString() + ' Hz';
  };
</script>

<div class="technical-info">
  {#if trackStore.commonMetadata}
    {@const sampleRateState = trackStore.commonMetadata.sampleRate}
    {@const bitDepthState = trackStore.commonMetadata.bitDepth}
    {@const channelsState = trackStore.commonMetadata.channels}

    <div class="info-group">
      <div class="info-label">Sample Rate / Bit Depth</div>
      <div class="info-value">
        {#if sampleRateState?.type === 'uniform'}
          {formatHz(sampleRateState.value)}
        {:else}
          Mixed
        {/if}
        /
        {#if bitDepthState?.type === 'uniform'}
          {bitDepthState.value} bit
        {:else}
          Mixed
        {/if}
      </div>
    </div>

    <div class="info-group">
      <div class="info-label">Channels</div>
      <div class="info-value">
        {#if channelsState?.type === 'uniform'}
          {channelsState.value} ch
        {:else}
          Mixed
        {/if}
      </div>
    </div>
  {/if}

  {#if trackStore.selectedTracks.length === 1}
    {@const track = trackStore.selectedTracks[0]}
    <div class="info-group">
      <div class="info-label">Duration</div>
      <div class="info-value">{Math.floor(track.metadata.streamInfo?.duration ?? 0)} s</div>
    </div>

    <div class="info-group">
      <div class="info-label">Location</div>
      <div class="info-value path-text" use:tooltip={track.path}>
        {track.path}
      </div>
    </div>
  {/if}
</div>

<style>
  .technical-info {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-primary);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .info-group {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .info-label {
    font-size: 0.65rem;
    color: var(--text-muted);
    text-transform: uppercase;
    font-weight: bold;
    letter-spacing: 0.5px;
  }

  .info-value {
    font-size: 0.75rem;
    color: var(--text-secondary);
  }

  .path-text {
    word-break: break-all;
    line-height: 1.4;
    opacity: 0.8;
  }
</style>
