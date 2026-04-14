<script lang="ts">
  import { trackStore } from '../../stores/track-store.svelte';
  import { tagActions } from '../../services/tag-actions';
  import MultiValueField from './MultiValueField.svelte';
  import { getSingleFieldValue, handleSingleInput } from './tag-field-handlers';
</script>

{#if trackStore.commonMetadata}
  {@const common = trackStore.commonMetadata}
  {@const artistState = common.artist}
  {@const albumArtistState = common.albumArtist}

  <div class="basic-fields">
    <div class="field">
      <label for="title">Title</label>
      <input
        id="title"
        type="text"
        value={getSingleFieldValue('title')}
        oninput={(e) => handleSingleInput('title', e)}
        placeholder="Title"
        disabled={trackStore.selectedTracks.length > 1}
        class:disabled={trackStore.selectedTracks.length > 1}
      />
    </div>

    <MultiValueField
      label="Artist"
      values={artistState.type === 'uniform' ? (artistState.value ?? []) : []}
      isUniform={artistState.type === 'uniform'}
      onUpdate={(i, v) => tagActions.updateSelectedMultiField('artist', i, v)}
      onAdd={() => tagActions.addSelectedMultiFieldValue('artist')}
      onRemove={(i) => tagActions.removeSelectedMultiFieldValue('artist', i)}
    />

    <div class="field">
      <label for="album">Album</label>
      <input
        id="album"
        type="text"
        value={getSingleFieldValue('album')}
        oninput={(e) => handleSingleInput('album', e)}
        placeholder="Album"
      />
    </div>

    <MultiValueField
      label="Album Artist"
      values={albumArtistState.type === 'uniform' ? (albumArtistState.value ?? []) : []}
      isUniform={albumArtistState.type === 'uniform'}
      onUpdate={(i, v) => tagActions.updateSelectedMultiField('albumArtist', i, v)}
      onAdd={() => tagActions.addSelectedMultiFieldValue('albumArtist')}
      onRemove={(i) => tagActions.removeSelectedMultiFieldValue('albumArtist', i)}
    />

    <div class="field">
      <label for="catalogNumber">Catalog Number</label>
      <input
        id="catalogNumber"
        type="text"
        value={getSingleFieldValue('catalogNumber')}
        oninput={(e) => handleSingleInput('catalogNumber', e)}
        placeholder="Catalog Number (e.g. ABCD-1234)"
      />
    </div>
  </div>
{/if}

<style>
  .basic-fields {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
</style>
