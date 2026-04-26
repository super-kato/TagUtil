<script lang="ts">
  import { Check, X } from '@lucide/svelte';
  import { UI_TOKENS } from '@renderer/constants/design-system';
  import { modalStore } from '@renderer/stores/modal-store.svelte';
  import Modal from './Modal.svelte';
</script>

{#if modalStore.options}
  {@const { title, message, icon: ICON } = modalStore.options}
  <Modal isOpen={modalStore.isOpen} onClose={() => modalStore.handleCancel()} {title}>
    {#snippet header()}
      <div class="header-content">
        <div class="icon-wrapper">
          <ICON size={UI_TOKENS.icons.logoSize} strokeWidth={UI_TOKENS.icons.strokeBold} />
        </div>
        <h2>{title}</h2>
      </div>
    {/snippet}

    <div class="message-container">
      <p>{message}</p>
    </div>

    {#snippet footer()}
      <button
        class="btn cancel"
        onclick={() => modalStore.handleCancel()}
        title="Cancel"
        aria-label="Cancel"
      >
        <X size={UI_TOKENS.icons.size} />
      </button>
      <button
        class="btn confirm glow-pulse"
        onclick={() => modalStore.handleConfirm()}
        title="Confirm"
        aria-label="Confirm"
      >
        <Check size={UI_TOKENS.icons.size} />
      </button>
    {/snippet}
  </Modal>
{/if}

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
    color: var(--accent-primary);
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
</style>
