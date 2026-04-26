<script lang="ts">
  import { trackStore } from '@renderer/stores/track-store.svelte';
  import { tagActions } from '@renderer/services/tag-actions';

  import MultiValueField from '@renderer/components/ui/MultiValueField.svelte';
  import {
    getSingleFieldValue,
    handleSingleFieldChange,
    handleEnterToBlur,
    getMultiFieldValues
  } from './tag-field-handlers';
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
        oninput={(e) => handleSingleFieldChange('title', e)}
        onkeydown={handleEnterToBlur}
        placeholder="Title"
        disabled={trackStore.selectedTracks.length > 1}
        class:disabled={trackStore.selectedTracks.length > 1}
      />
    </div>

    <MultiValueField
      label="Artist"
      values={getMultiFieldValues(artistState)}
      isUniform={artistState.type === 'uniform'}
      onUpdate={(i, v) => tagActions.updateSelectedMultiField('artist', i, v)}
      onAdd={() => tagActions.addSelectedMultiFieldValue('artist')}
      onRemove={(v) => tagActions.removeSelectedMultiFieldValue('artist', v)}
      onApplyChange={(oldV, newV) => tagActions.applySelectedMultiFieldChange('artist', oldV, newV)}
    />

    <div class="field">
      <label for="album">Album</label>
      <input
        id="album"
        type="text"
        value={getSingleFieldValue('album')}
        oninput={(e) => handleSingleFieldChange('album', e)}
        onkeydown={handleEnterToBlur}
        placeholder="Album"
      />
    </div>

    <MultiValueField
      label="Album Artist"
      values={getMultiFieldValues(albumArtistState)}
      isUniform={albumArtistState.type === 'uniform'}
      onUpdate={(i, v) => tagActions.updateSelectedMultiField('albumArtist', i, v)}
      onAdd={() => tagActions.addSelectedMultiFieldValue('albumArtist')}
      onRemove={(v) => tagActions.removeSelectedMultiFieldValue('albumArtist', v)}
      onApplyChange={(oldV, newV) =>
        tagActions.applySelectedMultiFieldChange('albumArtist', oldV, newV)}
    />

    <div class="field">
      <label for="catalogNumber">Catalog Number</label>
      <input
        id="catalogNumber"
        type="text"
        value={getSingleFieldValue('catalogNumber')}
        oninput={(e) => handleSingleFieldChange('catalogNumber', e)}
        onkeydown={handleEnterToBlur}
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
