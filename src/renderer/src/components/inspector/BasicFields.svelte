<script lang="ts">
  import { tagState } from '../../stores/tag-state.svelte';
  import MultiValueField from './MultiValueField.svelte';
  import { getSingleFieldValue, handleSingleInput } from './tag-field-handlers';
</script>

{#if tagState.commonMetadata}
  {@const artistState = tagState.commonMetadata.artist}
  {@const albumArtistState = tagState.commonMetadata.albumArtist}

  <div class="basic-fields">
    <div class="field">
      <label for="title">Title</label>
      <input
        id="title"
        type="text"
        value={getSingleFieldValue('title')}
        oninput={(e) => handleSingleInput('title', e)}
        placeholder="Title"
        disabled={tagState.selectedTracks.length > 1}
        class:disabled={tagState.selectedTracks.length > 1}
      />
    </div>

    <MultiValueField
      label="Artist"
      values={artistState.type === 'uniform' ? (artistState.value ?? []) : []}
      isUniform={artistState.type === 'uniform'}
      onUpdate={(i, v) => tagState.updateSelectedMultiField('artist', i, v)}
      onAdd={() => tagState.addSelectedMultiFieldValue('artist')}
      onRemove={(i) => tagState.removeSelectedMultiFieldValue('artist', i)}
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
      onUpdate={(i, v) => tagState.updateSelectedMultiField('albumArtist', i, v)}
      onAdd={() => tagState.addSelectedMultiFieldValue('albumArtist')}
      onRemove={(i) => tagState.removeSelectedMultiFieldValue('albumArtist', i)}
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
