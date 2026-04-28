<script lang="ts">
  import { type Snippet } from 'svelte';

  interface Props {
    /** モーダルの開閉状態 */
    isOpen: boolean;
    /** モーダルを閉じる際のコールバック */
    onClose: () => void;
    /** タイトル */
    title: string;
    /** ヘッダー部分のカスタムスニペット */
    header?: Snippet;
    /** 本文部分のスニペット */
    children: Snippet;
    /** フッター部分のスニペット */
    footer?: Snippet;
    /** 最大横幅（デフォルト: 480px） */
    maxWidth?: string;
  }

  let { isOpen, onClose, title, header, children, footer, maxWidth = '480px' }: Props = $props();

  let dialog: HTMLDialogElement;

  // isOpen の変更を監視して showModal / close を制御
  $effect(() => {
    if (isOpen === dialog.open) {
      return;
    }

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  });

  const handleCancel = (e: Event): void => {
    // Escキー押下時など、ブラウザ標準のキャンセル動作をハンドル
    e.preventDefault();
    onClose();
  };

  /**
   * 背景クリックで閉じる処理。
   * dialog 要素自体のクリックを検知し、content 外（backdrop）であれば閉じる。
   */
  const handleBackdropClick = (e: MouseEvent): void => {
    const target = e.target as HTMLElement;
    if (target.tagName !== 'DIALOG') {
      return;
    }
    onClose();
  };
</script>

<dialog
  bind:this={dialog}
  oncancel={handleCancel}
  onclick={handleBackdropClick}
  class="custom-modal"
  style="max-width: {maxWidth}"
>
  <div class="modal-container" role="document">
    <header class="modal-header">
      {#if header}
        {@render header()}
      {:else}
        <h2>{title}</h2>
      {/if}
    </header>

    <main class="modal-body">
      {@render children()}
    </main>

    {#if footer}
      <footer class="modal-footer">
        {@render footer()}
      </footer>
    {/if}
  </div>
</dialog>

<style>
  .custom-modal {
    padding: 0;
    border: none;
    border-radius: var(--radius-xl);
    background-color: var(--bg-main);
    box-shadow:
      0 20px 25px -5px rgba(0, 0, 0, 0.4),
      0 10px 10px -5px rgba(0, 0, 0, 0.2);
    color: var(--text-primary);
    width: 90%;
    border: 1px solid var(--border-primary);
    overflow: hidden;
  }

  /* 背景のオーバーレイ */
  .custom-modal::backdrop {
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    animation: fade-in 0.2s ease-out;
  }

  /* モーダル本体のアニメーション */
  .custom-modal[open] {
    animation: scale-up 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes scale-up {
    from {
      transform: scale(0.95);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  .modal-container {
    display: flex;
    flex-direction: column;
    outline: none;
  }

  .modal-header {
    padding: 1rem 1.5rem;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: -0.01em;
  }

  .modal-body {
    padding: 0.75rem 1.5rem;
    font-size: 0.95rem;
    line-height: 1.6;
    color: var(--text-secondary);
    white-space: pre-wrap; /* メッセージ内の改行を反映 */
  }

  .modal-footer {
    padding: 0.75rem 1.5rem 1rem;
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
  }
</style>
