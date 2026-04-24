import { describe, it, expect, vi } from 'vitest';
import { KeyboardHandler } from './keyboard-handler';

describe('KeyboardHandler', () => {
  it('登録されたキーが押された時にハンドラーが実行されること', () => {
    const callback = vi.fn();
    const handler = new KeyboardHandler(false, [
      {
        combo: { key: 'a' },
        handler: callback
      }
    ]);

    const event = { key: 'a' } as KeyboardEvent;
    handler.handle(event);

    expect(callback).toHaveBeenCalled();
  });

  it('大文字小文字を区別せずに判定すること', () => {
    const callback = vi.fn();
    const handler = new KeyboardHandler(false, [
      {
        combo: { key: 'a' },
        handler: callback
      }
    ]);

    const event = { key: 'A' } as KeyboardEvent;
    handler.handle(event);

    expect(callback).toHaveBeenCalled();
  });

  describe('modキーの判定', () => {
    it('Mac環境では mod は Meta キーとして扱われること', () => {
      const callback = vi.fn();
      const handler = new KeyboardHandler(true, [
        {
          combo: { key: 's', mod: true },
          handler: callback
        }
      ]);

      // Meta+S (Mac)
      handler.handle({ key: 's', metaKey: true, ctrlKey: false } as KeyboardEvent);
      expect(callback).toHaveBeenCalledTimes(1);

      // Ctrl+S (Macでは不一致)
      handler.handle({ key: 's', metaKey: false, ctrlKey: true } as KeyboardEvent);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('Mac以外の環境では mod は Ctrl キーとして扱われること', () => {
      const callback = vi.fn();
      const handler = new KeyboardHandler(false, [
        {
          combo: { key: 's', mod: true },
          handler: callback
        }
      ]);

      // Ctrl+S (Windows/Linux)
      handler.handle({ key: 's', metaKey: false, ctrlKey: true } as KeyboardEvent);
      expect(callback).toHaveBeenCalledTimes(1);

      // Meta+S (Windows/Linuxでは不一致)
      handler.handle({ key: 's', metaKey: true, ctrlKey: false } as KeyboardEvent);
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  it('preventDefault が true の場合に event.preventDefault が呼ばれること', () => {
    const event = {
      key: 'a',
      preventDefault: vi.fn()
    } as unknown as KeyboardEvent;

    const handler = new KeyboardHandler(false, [
      {
        combo: { key: 'a' },
        handler: vi.fn(),
        preventDefault: true
      }
    ]);

    handler.handle(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('enabled が false を返す場合はハンドラーが実行されないこと', () => {
    const callback = vi.fn();
    const handler = new KeyboardHandler(false, [
      {
        combo: { key: 'a' },
        handler: callback,
        enabled: () => false
      }
    ]);

    handler.handle({ key: 'a' } as KeyboardEvent);
    expect(callback).not.toHaveBeenCalled();
  });
});
