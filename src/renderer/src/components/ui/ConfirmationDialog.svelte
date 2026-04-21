<script lang="ts">
  import { modalStore } from '@renderer/stores/modal-store.svelte';
  import Modal from './Modal.svelte';
  import { AlertCircle, Info } from '@lucide/svelte';
  import { UI_TOKENS } from '@renderer/constants/design-system';

  // アイコンの選定
  const iconComponent = $derived.by(() => {
    switch (modalStore.options.variant) {
      case 'danger':
        return AlertCircle;
      case 'warning':
        return AlertCircle;
      default:
        return Info;
    }
  });

  const iconColor = $derived.by(() => {
    switch (modalStore.options.variant) {
      case 'danger':
        return 'var(--accent-error)';
      case 'warning':
        return 'var(--accent-warning)';
      default:
        return 'var(--accent-primary)';
    }
  });
</script>

<Modal
  isOpen={modalStore.isOpen}
  onClose={() => modalStore.handleCancel()}
  title={modalStore.options.title}
>
  {#snippet header()}
    {@const ICON = iconComponent}
    <div class="header-content">
      <div class="icon-wrapper" style:color={iconColor}>
        <ICON size={UI_TOKENS.icons.logoSize} strokeWidth={UI_TOKENS.icons.strokeBold}></ICON>
      </div>
      <h2>{modalStore.options.title}</h2>
    </div>
  {/snippet}

  <div class="message-container">
    <p>{modalStore.options.message}</p>
  </div>

  {#snippet footer()}
    <button class="btn secondary" onclick={() => modalStore.handleCancel()}>
      {modalStore.options.cancelLabel}
    </button>
    <button class="btn {modalStore.options.variant}" onclick={() => modalStore.handleConfirm()}>
      {modalStore.options.confirmLabel}
    </button>
  {/snippet}
</Modal>

<style>
  .header-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .header-content h2 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .message-container {
    color: var(--text-secondary);
  }

  .btn {
    padding: 0.6rem 1.2rem;
    border-radius: var(--radius-md);
    border: none;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 80px;
  }

  .secondary {
    background-color: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-primary);
  }

  .secondary:hover {
    background-color: var(--bg-hover);
    border-color: var(--border-secondary);
  }

  .primary {
    background-color: var(--accent-primary);
    color: var(--bg-body);
  }

  .primary:hover {
    filter: brightness(1.1);
    box-shadow: 0 0 12px var(--accent-primary-dim);
  }

  .danger {
    background-color: var(--accent-error);
    color: white;
  }

  .danger:hover {
    filter: brightness(1.1);
    box-shadow: 0 0 12px rgba(255, 59, 48, 0.3);
  }

  .warning {
    background-color: var(--accent-warning);
    color: var(--bg-body);
  }

  .warning:hover {
    filter: brightness(1.1);
    box-shadow: 0 0 12px rgba(255, 159, 10, 0.3);
  }
</style>
