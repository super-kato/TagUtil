<script lang="ts">
  import { tagState } from '../../stores/tag-state.svelte';

  const CHANNELS_MONO = 1;
  const CHANNELS_STEREO = 2;

  const formatHz = (hz: number | undefined): string => {
    if (hz === undefined) {
      return '-';
    }
    return hz.toLocaleString() + ' Hz';
  };

  const formatChannels = (ch: number | undefined): string => {
    if (ch === undefined) {
      return '-';
    }
    if (ch === CHANNELS_MONO) {
      return 'Mono';
    }
    if (ch === CHANNELS_STEREO) {
      return 'Stereo';
    }
    return `${ch} ch`;
  };
</script>

<div class="technical-info">
  <!-- 複数選択時でも共通なら表示する項目 -->
  {#if tagState.commonMetadata}
    {@const sampleRateState = tagState.commonMetadata.sampleRate}
    {@const bitDepthState = tagState.commonMetadata.bitDepth}
    {@const channelsState = tagState.commonMetadata.channels}

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
          {formatChannels(channelsState.value)}
        {:else}
          Mixed
        {/if}
      </div>
    </div>
  {/if}

  <!-- 単一選択時のみの意味がある項目 -->
  {#if tagState.selectedTracks.length === 1}
    {@const track = tagState.selectedTracks[0]}
    <div class="info-group">
      <div class="info-label">Duration</div>
      <div class="info-value">{Math.floor(track.metadata.streamInfo?.duration ?? 0)} s</div>
    </div>

    <div class="info-group">
      <div class="info-label">Location</div>
      <div class="info-value path-text" title={track.path}>
        {track.path}
      </div>
    </div>
  {/if}
</div>

<style>
  .technical-info {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #333;
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
    color: #666;
    text-transform: uppercase;
    font-weight: bold;
    letter-spacing: 0.5px;
  }

  .info-value {
    font-size: 0.75rem;
    color: #999;
  }

  .path-text {
    word-break: break-all;
    line-height: 1.4;
    opacity: 0.8;
  }
</style>
