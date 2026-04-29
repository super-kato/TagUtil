/** @vitest-environment jsdom */
import type { BatchMetadataSummary, FieldState } from '@domain/editor/batch-metadata';
import { tagActions } from '@renderer/services/tag-actions';
import { trackStore } from '@renderer/stores/track-store.svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getMultiFieldValues,
  getSingleFieldValue,
  handleEnterToBlur,
  handleSingleFieldChange
} from './tag-field-handlers';

vi.mock('@renderer/services/tag-actions');
vi.mock('@renderer/stores/track-store.svelte', () => ({
  trackStore: {
    commonMetadata: null as BatchMetadataSummary | null
  }
}));

describe('tag-field-handlers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('handleSingleFieldChange', () => {
    it('入力値を tagActions.updateSelectedSingleField に渡すこと', () => {
      const input = document.createElement('input');
      input.value = 'new title';

      let capturedEvent: Event | undefined;
      input.addEventListener('input', (e) => {
        capturedEvent = e;
      });
      input.dispatchEvent(new Event('input'));

      if (capturedEvent) {
        handleSingleFieldChange('title', capturedEvent);
      }

      expect(tagActions.updateSelectedSingleField).toHaveBeenCalledWith('title', 'new title');
    });
  });

  describe('getSingleFieldValue', () => {
    const getMockStore = (): { commonMetadata: BatchMetadataSummary | null } =>
      trackStore as { commonMetadata: BatchMetadataSummary | null };

    it('commonMetadataがnullの場合は空文字を返すこと', () => {
      getMockStore().commonMetadata = null;
      expect(getSingleFieldValue('title')).toBe('');
    });

    it('一様な（uniform）状態の場合はその値を返すこと', () => {
      // 必要なフィールドのみを持つオブジェクトを作成し、Partial を経由せずにキャスト
      // (BatchMetadataSummary の一部として振る舞うことを期待)
      const mockMetadata = {
        title: { type: 'uniform', value: 'Title A' }
      };
      getMockStore().commonMetadata = mockMetadata as BatchMetadataSummary;
      expect(getSingleFieldValue('title')).toBe('Title A');
    });

    it('混合（mixed）状態の場合は空文字を返すこと', () => {
      const mockMetadata = {
        title: { type: 'mixed' }
      };
      getMockStore().commonMetadata = mockMetadata as BatchMetadataSummary;
      expect(getSingleFieldValue('title')).toBe('');
    });
  });

  describe('getMultiFieldValues', () => {
    it('uniformの場合はその値を返すこと', () => {
      const state: FieldState<string[] | undefined> = { type: 'uniform', value: ['Genre A'] };
      expect(getMultiFieldValues(state)).toEqual(['Genre A']);
    });

    it('divergentの場合は全ての値を返すこと', () => {
      const state: FieldState<string[] | undefined> = {
        type: 'divergent',
        values: ['Genre A', 'Genre B']
      };
      expect(getMultiFieldValues(state)).toEqual(['Genre A', 'Genre B']);
    });
  });

  describe('handleEnterToBlur', () => {
    it('Enterキー押下時にblurを呼び出すこと', () => {
      const input = document.createElement('input');
      const blurSpy = vi.spyOn(input, 'blur');
      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });

      input.addEventListener('keydown', (e) => handleEnterToBlur(e as KeyboardEvent));
      input.dispatchEvent(event);

      expect(blurSpy).toHaveBeenCalled();
    });
  });
});
