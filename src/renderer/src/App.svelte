<script lang="ts">
  import DropZone from './components/DropZone.svelte';
  import Inspector from './components/Inspector.svelte';
  import StatusBar from './components/StatusBar.svelte';
  import Toolbar from './components/Toolbar.svelte';
  import TrackGrid from './components/TrackGrid.svelte';
  import { tagActions } from './services/tag-actions';
</script>

<DropZone onDrop={(paths) => tagActions.loadFromPaths(paths)}>
  <div class="app-container" role="region" aria-label="Application container">
    <section class="main-content">
      <Toolbar />
      <TrackGrid />
      <StatusBar />
    </section>

    <Inspector />
  </div>
</DropZone>

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
    overflow: hidden;
  }
</style>
