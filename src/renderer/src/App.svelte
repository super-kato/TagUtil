<script lang="ts">
  import { logRepository } from '@renderer/infrastructure/repositories/log-repository';
  import { onMount } from 'svelte';
  import { setAppTheme } from '@renderer/utils/dom-utils';
  import Inspector from './components/Inspector.svelte';
  import KeyboardShortcuts from './components/KeyboardShortcuts.svelte';
  import SettingsModal from './components/SettingsModal.svelte';
  import StatusBar from './components/StatusBar.svelte';
  import Toolbar from './components/Toolbar.svelte';
  import TrackGrid from './components/TrackGrid.svelte';
  import ConfirmationDialog from './components/ui/ConfirmationDialog.svelte';
  import TooltipContainer from './components/ui/TooltipContainer.svelte';
  import { logStore } from './stores/log-store.svelte';
  import { settingsStore } from './stores/settings-store.svelte';

  const initializeApp = async (): Promise<void> => {
    await settingsStore.refresh();
    await window.api.showMainWindow();
  };

  onMount(() => {
    const unsubscribe = logRepository.subscribe((log) => logStore.addLog(log));
    initializeApp();
    return () => unsubscribe();
  });

  // テーマの変更を監視して適用
  $effect(() => {
    const theme = settingsStore.current?.theme;
    if (!theme) {
      return;
    }
    setAppTheme(theme);
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
  <SettingsModal />
  <ConfirmationDialog />
  <TooltipContainer />
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
    background-color: var(--bg-main);
    border-right: 1px solid var(--border-primary);
    overflow: clip;
    min-height: 0;
    min-width: 0;
  }
</style>
