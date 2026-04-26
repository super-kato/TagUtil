<script lang="ts">
  import { tooltipStore } from '@renderer/stores/tooltip-store.svelte';

  let popoverElement: HTMLDivElement | undefined = $state();

  // Store の状態をネイティブの Popover API に同期させる
  $effect(() => {
    if (!popoverElement) {
      return;
    }

    if (tooltipStore.isVisible) {
      popoverElement.showPopover();
      return;
    }

    try {
      popoverElement.hidePopover();
    } catch {
      // すでに閉じている場合の例外を無視
    }
  });
</script>

<div
  bind:this={popoverElement}
  popover="manual"
  class="custom-tooltip-popover"
  class:visible={tooltipStore.isVisible}
  style:position-anchor={tooltipStore.anchorName}
>
  {tooltipStore.text}
</div>
