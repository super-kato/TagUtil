import { describe, it, expect, beforeEach } from 'vitest';
import { modalStore } from './modal-store.svelte';

describe('ModalStore', () => {
  beforeEach(() => {
    // 状態をリセットするためにキャンセルを呼ぶ
    modalStore.handleCancel();
  });

  it('初期状態では閉じていること', () => {
    expect(modalStore.isOpen).toBe(false);
  });

  it('confirm を呼ぶと isOpen が true になり、オプションが正しく設定されること', () => {
    modalStore.confirm({
      title: 'テストタイトル',
      message: 'テストメッセージ',
      confirmLabel: '実行',
      variant: 'danger'
    });

    expect(modalStore.isOpen).toBe(true);
    expect(modalStore.options.title).toBe('テストタイトル');
    expect(modalStore.options.message).toBe('テストメッセージ');
    expect(modalStore.options.confirmLabel).toBe('実行');
    expect(modalStore.options.variant).toBe('danger');
  });

  it('handleConfirm を呼ぶと Promise が true で解決され、閉じられること', async () => {
    const confirmPromise = modalStore.confirm({
      title: 'タイトル',
      message: 'メッセージ'
    });

    modalStore.handleConfirm();
    const result = await confirmPromise;

    expect(result).toBe(true);
    expect(modalStore.isOpen).toBe(false);
  });

  it('handleCancel を呼ぶと Promise が false で解決され、閉じられること', async () => {
    const confirmPromise = modalStore.confirm({
      title: 'タイトル',
      message: 'メッセージ'
    });

    modalStore.handleCancel();
    const result = await confirmPromise;

    expect(result).toBe(false);
    expect(modalStore.isOpen).toBe(false);
  });

  it('新しい confirm を呼ぶと、以前の Promise は false で解決されること', async () => {
    const firstPromise = modalStore.confirm({ title: '1', message: '1' });
    const secondPromise = modalStore.confirm({ title: '2', message: '2' });

    const firstResult = await firstPromise;
    expect(firstResult).toBe(false);
    expect(modalStore.isOpen).toBe(true);
    expect(modalStore.options.title).toBe('2');

    modalStore.handleConfirm();
    const secondResult = await secondPromise;
    expect(secondResult).toBe(true);
  });
});
