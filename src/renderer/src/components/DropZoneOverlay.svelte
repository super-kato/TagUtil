<script lang="ts">
  import { UI_TOKENS } from '@renderer/constants/design-system';
  import { type IconProps } from '@lucide/svelte';
  import type { Component } from 'svelte';

  interface Props {
    icon: Component<IconProps>;
    title: string;
    sub?: string;
  }

  let { icon: ICON, title, sub }: Props = $props();
</script>

<div class="drop-content">
  <div class="icon-wrapper">
    <ICON size={UI_TOKENS.icons.sizeLarge} strokeWidth={1} />
  </div>
  <h2>{title}</h2>
  {#if sub}
    <p>{sub}</p>
  {/if}
</div>

<style>
  .drop-content {
    text-align: center;
    color: var(--accent-primary);
  }

  .drop-content h2 {
    font-size: 1.5rem;
    margin: 1rem 0 0.5rem;
    font-weight: 600;
  }

  .drop-content p {
    color: var(--text-muted);
    font-size: 1rem;
  }

  .icon-wrapper {
    background: var(--accent-primary-dim);
    color: var(--accent-primary);
    width: 96px;
    height: 96px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
  }
</style>
