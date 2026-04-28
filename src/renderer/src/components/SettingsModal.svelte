<script lang="ts">
  import { TAG_PLACEHOLDERS } from '@domain/audio/constants';
  import { Bug, FilePen, List, Save, Star, X } from '@lucide/svelte';
  import { UI_TOKENS } from '@renderer/constants/design-system';
  import { MAX_QUICK_GENRES, settingsStore } from '@renderer/stores/settings-store.svelte';
  import { uiState } from '@renderer/stores/ui-state.svelte';
  import { type ColorTheme, type LogLevel } from '@shared/settings';
  import BadgeField from './ui/BadgeField.svelte';
  import Modal from './ui/Modal.svelte';

  const handleSave = async (): Promise<void> => {
    await settingsStore.save();
    uiState.closeSettings();
  };

  const handleCancel = async (): Promise<void> => {
    // 変更を破棄してディスクの状態に戻す
    await settingsStore.refresh();
    uiState.closeSettings();
  };

  const themes: ColorTheme[] = ['light', 'dark', 'system'];
  const logLevels: LogLevel[] = ['INFO', 'DEBUG'];
</script>

<Modal isOpen={uiState.isSettingsOpen} onClose={handleCancel} title="Settings">
  {#if settingsStore.current}
    <div class="settings-content">
      <!-- Section: Appearance -->
      <section class="settings-section">
        <div class="field">
          <div class="toggle-group" id="setting-theme">
            {#each themes as theme (theme)}
              <button
                type="button"
                class="toggle-btn"
                class:active={settingsStore.current.theme === theme}
                onclick={() => settingsStore.update('theme', theme)}
              >
                {theme}
              </button>
            {/each}
          </div>
        </div>
      </section>

      <!-- Section: Logging (Debug) -->
      <section class="settings-section">
        <div class="section-header">
          <Bug size={UI_TOKENS.icons.size} />
          <h3>Logging</h3>
        </div>
        <div class="field">
          <div class="toggle-group" id="setting-log-level">
            {#each logLevels as level (level)}
              <button
                type="button"
                class="toggle-btn"
                class:active={settingsStore.current.logLevel === level}
                onclick={() => settingsStore.update('logLevel', level)}
              >
                {level}
              </button>
            {/each}
          </div>
        </div>
      </section>

      <!-- Section: Renaming Settings -->
      <section class="settings-section">
        <div class="section-header">
          <FilePen size={UI_TOKENS.icons.size} />
          <h3>File Naming</h3>
        </div>
        <div class="field">
          <label for="setting-rename-pattern">Rename Format</label>
          <input
            id="setting-rename-pattern"
            type="text"
            value={settingsStore.current.renamePattern}
            oninput={(e) => settingsStore.update('renamePattern', e.currentTarget.value)}
            placeholder={`${TAG_PLACEHOLDERS.TRACK_NUMBER} - ${TAG_PLACEHOLDERS.TITLE}`}
          />
          <div class="placeholder-list">
            <span class="placeholder-label">Available:</span>
            {#each Object.values(TAG_PLACEHOLDERS) as tag (tag)}
              <code class="placeholder-tag">{tag}</code>
            {/each}
          </div>
        </div>
        <div class="field">
          <label for="setting-padding">Track Number Padding</label>
          <input
            id="setting-padding"
            type="number"
            min="1"
            max="4"
            value={settingsStore.current.trackNumberPadding}
            oninput={(e) =>
              settingsStore.update('trackNumberPadding', Number(e.currentTarget.value))}
          />
        </div>
      </section>

      <!-- Section: Genre Settings -->
      <section class="settings-section">
        <div class="section-header">
          <List size={UI_TOKENS.icons.size} />
          <h3>Genre List</h3>
        </div>
        <BadgeField
          values={settingsStore.current.genres}
          isUniform={true}
          onAdd={(val) => settingsStore.addGenre(val)}
          onRemove={(val) => settingsStore.removeGenre(val)}
        />
      </section>

      <!-- Section: Quick Genres -->
      <section class="settings-section">
        <div class="section-header">
          <Star size={UI_TOKENS.icons.size} />
          <h3>Quick Genres (Max {MAX_QUICK_GENRES})</h3>
        </div>
        <div class="quick-genre-list">
          {#each settingsStore.current.genres as genre (genre)}
            {@const isSelected = settingsStore.current?.quickGenres.includes(genre)}
            <label
              class="genre-item"
              class:selected={isSelected}
              class:disabled={!isSelected &&
                settingsStore.current.quickGenres.length >= MAX_QUICK_GENRES}
            >
              <input
                type="checkbox"
                checked={isSelected}
                disabled={!isSelected &&
                  settingsStore.current.quickGenres.length >= MAX_QUICK_GENRES}
                onchange={() => settingsStore.toggleQuickGenre(genre)}
              />
              <span class="genre-label">{genre}</span>
            </label>
          {/each}
        </div>
      </section>
    </div>
  {/if}

  {#snippet footer()}
    <button class="btn cancel" onclick={handleCancel} title="Cancel" aria-label="Cancel">
      <X size={UI_TOKENS.icons.size} />
    </button>
    <button
      class="btn confirm glow-pulse"
      onclick={handleSave}
      title="Save Changes"
      aria-label="Save Changes"
    >
      <Save size={UI_TOKENS.icons.size} />
    </button>
  {/snippet}
</Modal>

<style>
  .settings-content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding-bottom: 1rem;
    max-height: 60vh;
    overflow-y: auto;
    padding-right: 0.5rem;
  }

  .settings-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    color: var(--accent-primary);
    border-bottom: 1px solid var(--border-primary);
    padding-bottom: 0.5rem;
  }

  .section-header h3 {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  .placeholder-list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.4rem;
    margin-top: 0.4rem;
  }

  .placeholder-label {
    font-size: 0.7rem;
    color: var(--text-dim);
    margin-right: 0.2rem;
  }

  .placeholder-tag {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    background-color: var(--bg-secondary);
    color: var(--text-secondary);
    padding: 0.1rem 0.3rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-primary);
  }

  .quick-genre-list {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    padding: 0.4rem;
    background-color: var(--bg-secondary);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-primary);
    max-height: 200px;
    overflow-y: auto;
  }

  .genre-item {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.4rem 0.6rem;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .genre-item:hover:not(.disabled) {
    background-color: var(--bg-hover);
  }

  .genre-item.disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .genre-label {
    font-size: 0.85rem;
  }

  input[type='checkbox'] {
    accent-color: var(--accent-primary);
    cursor: pointer;
  }

  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
  }
  input[type='number'] {
    -moz-appearance: textfield;
    appearance: textfield;
  }

  .toggle-group {
    display: flex;
    background-color: var(--bg-secondary);
    padding: 0.25rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-primary);
    width: fit-content;
    gap: 0.25rem;
  }

  .toggle-btn {
    padding: 0.4rem 1.2rem;
    border-radius: var(--radius-sm);
    border: 1px solid transparent;
    background: none;
    color: var(--text-dim);
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    text-transform: capitalize;
  }

  .toggle-btn:hover:not(.active) {
    background-color: var(--bg-hover);
    color: var(--text-primary);
  }

  .toggle-btn.active {
    background-color: var(--bg-body);
    border: 1px solid var(--accent-primary);
    color: var(--accent-primary);
    box-shadow: var(--shadow-sm);
  }

  .btn {
    padding: 0.4rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-primary);
    background: transparent;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 32px;
  }

  .btn.confirm {
    border-color: var(--accent-primary);
    color: var(--accent-primary);
  }

  .btn.cancel {
    color: var(--text-secondary);
  }

  .btn:hover {
    background-color: var(--bg-hover);
    border-color: var(--text-dim);
  }
</style>
