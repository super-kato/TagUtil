<script lang="ts">
  import { UI_TOKENS } from '@renderer/constants/design-system';
  import { themeStore } from '@renderer/stores/theme-store.svelte';
  import { selectionState } from '@renderer/stores/selection-state.svelte';
  import StatusBar from './StatusBar.svelte';
  import Toolbar from './Toolbar.svelte';
  import TrackGrid from './TrackGrid.svelte';
  import Inspector from './Inspector.svelte';
  import ConfirmationDialog from './ui/ConfirmationDialog.svelte';

  $effect(() => {
    // テーマをHTML要素のデータ属性として適用
    document.documentElement.dataset.theme = themeStore.current;
  });
</script>

<div class="app-container">
  <Toolbar />

  <main class="main-layout">
    <div class="content-area">
      <TrackGrid />
    </div>

    <Inspector />
  </main>

  <StatusBar />

  <ConfirmationDialog />
</div>

<style>
  .app-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: var(--bg-body);
    color: var(--text-primary);
    overflow: hidden;
  }

  .main-layout {
    flex: 1;
    display: flex;
    overflow: hidden;
    min-height: 0;
  }

  .content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: var(--bg-main);
    border-right: 1px solid var(--border-primary);
    overflow: clip;
    min-height: 0;
    min-width: 0;
  }
</style>
