<script lang="ts">
  import { tagState } from '../../stores/tag-state.svelte';
  import { getSingleFieldValue, handleSingleInput } from './tag-field-handlers';
</script>

<div class="numeric-fields">
  <div class="field">
    <div class="label-row">
      <label for="trackNumber">Track</label>
      {#if tagState.selectedTracks.length > 1}
        <button
          class="auto-btn"
          onclick={() => tagState.applyAutoNumbering()}
          title="Auto numbering (1, 2...)"
        >
          Auto
        </button>
      {/if}
    </div>
    <div class="track-inputs">
      <input
        id="trackNumber"
        type="text"
        value={getSingleFieldValue('trackNumber')}
        oninput={(e) => handleSingleInput('trackNumber', e)}
        placeholder="#"
        disabled={tagState.selectedTracks.length > 1}
        class:disabled={tagState.selectedTracks.length > 1}
      />
      <span class="separator">/</span>
      <input
        id="trackTotal"
        type="text"
        value={getSingleFieldValue('trackTotal')}
        oninput={(e) => handleSingleInput('trackTotal', e)}
        placeholder="Tracks"
      />
    </div>
  </div>

  <div class="field disc-group">
    <label for="discNumber">Disc</label>
    <div class="disc-inputs">
      <input
        id="discNumber"
        type="text"
        value={getSingleFieldValue('discNumber')}
        oninput={(e) => handleSingleInput('discNumber', e)}
        placeholder="#"
      />
      <span class="separator">/</span>
      <input
        id="discTotal"
        type="text"
        value={getSingleFieldValue('discTotal')}
        oninput={(e) => handleSingleInput('discTotal', e)}
        placeholder="Discs"
      />
    </div>
  </div>

  <div class="field">
    <label for="date">Date</label>
    <input
      id="date"
      type="text"
      value={getSingleFieldValue('date')}
      oninput={(e) => handleSingleInput('date', e)}
      placeholder="YYYY"
    />
  </div>
</div>

<style>
  .numeric-fields {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .track-inputs,
  .disc-inputs {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .track-inputs input,
  .disc-inputs input {
    width: 0;
    flex: 1;
  }

  .label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.1rem;
  }

  .separator {
    color: var(--border-secondary);
    font-size: 1.2rem;
    line-height: 1;
  }

  .auto-btn {
    background: transparent;
    border: none;
    color: var(--text-muted);
    font-size: 0.65rem;
    padding: 2px 4px;
    border-radius: 4px;
    cursor: pointer;
    text-transform: uppercase;
    font-weight: bold;
    transition: all 0.2s;
  }

  .auto-btn:hover {
    color: var(--accent-primary);
  }
</style>
