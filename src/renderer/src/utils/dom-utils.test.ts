/** @vitest-environment jsdom */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { isInputFocused, setAppTheme } from './dom-utils';

describe('dom-utils', () => {
  describe('isInputFocused', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('INPUT要素にフォーカスがある場合に true を返すこと', () => {
      const input = document.createElement('input');
      vi.spyOn(document, 'activeElement', 'get').mockReturnValue(input);
      expect(isInputFocused()).toBe(true);
    });

    it('TEXTAREA要素にフォーカスがある場合に true を返すこと', () => {
      const textarea = document.createElement('textarea');
      vi.spyOn(document, 'activeElement', 'get').mockReturnValue(textarea);
      expect(isInputFocused()).toBe(true);
    });

    it('contenteditable属性を持つ要素にフォーカスがある場合に true を返すこと', () => {
      const div = document.createElement('div');
      Object.defineProperty(div, 'isContentEditable', {
        get: () => true,
        configurable: true
      });
      vi.spyOn(document, 'activeElement', 'get').mockReturnValue(div);

      expect(isInputFocused()).toBe(true);
    });

    it('入力不可な要素にフォーカスがある場合に false を返すこと', () => {
      const button = document.createElement('button');
      vi.spyOn(document, 'activeElement', 'get').mockReturnValue(button);
      expect(isInputFocused()).toBe(false);
    });

    it('フォーカスがない場合に false を返すこと', () => {
      vi.spyOn(document, 'activeElement', 'get').mockReturnValue(null);
      expect(isInputFocused()).toBe(false);
    });
  });

  describe('setAppTheme', () => {
    it('document.documentElement に data-theme 属性を設定すること', () => {
      setAppTheme('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

      setAppTheme('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');

      setAppTheme('system');
      expect(document.documentElement.getAttribute('data-theme')).toBe('system');
    });
  });
});
