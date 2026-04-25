<script lang="ts">
  import Inspector from './components/Inspector.svelte';
  import StatusBar from './components/StatusBar.svelte';
  import Toolbar from './components/Toolbar.svelte';
  import TrackGrid from './components/TrackGrid.svelte';
  import KeyboardShortcuts from './components/KeyboardShortcuts.svelte';
  import ConfirmationDialog from './components/ui/ConfirmationDialog.svelte';
  import { onMount } from 'svelte';
  import { logStore } from './stores/log-store.svelte';

  onMount(() => {
    const unsubscribe = window.api.onLogMessage((message) => {
      logStore.addLog(message);
    });
    return unsubscribe;
  });
</script>

<KeyboardShortcuts />

<div
  class="app-container no-focus-glow"
  role="region"
  aria-label="Application container"
  tabindex="-1"
>
  <section class="main-content">
    <Toolbar />
    <TrackGrid />
    <StatusBar />
  </section>

  <Inspector />
  <ConfirmationDialog />
</div>

<style>
  .app-container {
    display: flex;
    height: 100vh;
    position: relative;
  }

  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: #1e1e1e;
    border-right: 1px solid #333;
    overflow: clip;
    min-height: 0;
  }
</style>
