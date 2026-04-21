import { describe, it, expect, beforeEach } from 'vitest';
import { modalStore } from './modal-store.svelte';
import { Info } from '@lucide/svelte';

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
      icon: Info
    });

    expect(modalStore.isOpen).toBe(true);
    expect(modalStore.options?.title).toBe('テストタイトル');
    expect(modalStore.options?.message).toBe('テストメッセージ');
    expect(modalStore.options?.icon).toBe(Info);
  });

  it('handleConfirm を呼ぶと Promise が true で解決され、閉じられること', async () => {
    const confirmPromise = modalStore.confirm({
      title: 'タイトル',
      message: 'メッセージ',
      icon: Info
    });

    modalStore.handleConfirm();
    const result = await confirmPromise;

    expect(result).toBe(true);
    expect(modalStore.isOpen).toBe(false);
  });

  it('handleCancel を呼ぶと Promise が false で解決され、閉じられること', async () => {
    const confirmPromise = modalStore.confirm({
      title: 'タイトル',
      message: 'メッセージ',
      icon: Info
    });

    modalStore.handleCancel();
    const result = await confirmPromise;

    expect(result).toBe(false);
    expect(modalStore.isOpen).toBe(false);
  });

  it('新しい confirm を呼ぶと、以前の Promise は false で解決されること', async () => {
    const firstPromise = modalStore.confirm({ title: '1', message: '1', icon: Info });
    const secondPromise = modalStore.confirm({ title: '2', message: '2', icon: Info });

    const firstResult = await firstPromise;
    expect(firstResult).toBe(false);
    expect(modalStore.isOpen).toBe(true);
    expect(modalStore.options?.title).toBe('2');

    modalStore.handleConfirm();
    const secondResult = await secondPromise;
    expect(secondResult).toBe(true);
  });
});
