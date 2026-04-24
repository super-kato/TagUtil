import { describe, it, expect, vi } from 'vitest';
import { KeyboardHandler } from './keyboard-handler';

describe('KeyboardHandler', () => {
  it('登録されたキーが押された時にハンドラーが実行されること', async () => {
    const callback = vi.fn();
    const handler = new KeyboardHandler(false, [
      {
        combo: { key: 'a' },
        handler: callback
      }
    ]);

    const event = { key: 'a' } as KeyboardEvent;
    await handler.handle(event);

    expect(callback).toHaveBeenCalled();
  });

  it('大文字小文字を区別せずに判定すること', async () => {
    const callback = vi.fn();
    const handler = new KeyboardHandler(false, [
      {
        combo: { key: 'a' },
        handler: callback
      }
    ]);

    const event = { key: 'A' } as KeyboardEvent;
    await handler.handle(event);

    expect(callback).toHaveBeenCalled();
  });

  describe('修飾キー（ctrl）の判定', () => {
    it('isMac が true の環境では ctrl は Meta キーとして扱われること', async () => {
      const callback = vi.fn();
      const handler = new KeyboardHandler(true, [
        {
          combo: { key: 's', ctrl: true },
          handler: callback
        }
      ]);

      // Meta+S (MacのCommand+Sに相当)
      await handler.handle({ key: 's', metaKey: true, ctrlKey: false } as KeyboardEvent);
      expect(callback).toHaveBeenCalledTimes(1);

      // Ctrl+S (Macでは不一致)
      await handler.handle({ key: 's', metaKey: false, ctrlKey: true } as KeyboardEvent);
      expect(callback).toHaveBeenCalledTimes(1); // 1回のまま（呼ばれない）
    });

    it('isMac が false の環境では ctrl は Control キーとして扱われること', async () => {
      const callback = vi.fn();
      const handler = new KeyboardHandler(false, [
        {
          combo: { key: 's', ctrl: true },
          handler: callback
        }
      ]);

      // Ctrl+S
      await handler.handle({ key: 's', metaKey: false, ctrlKey: true } as KeyboardEvent);
      expect(callback).toHaveBeenCalledTimes(1);

      // Meta+S (不一致)
      await handler.handle({ key: 's', metaKey: true, ctrlKey: false } as KeyboardEvent);
      expect(callback).toHaveBeenCalledTimes(1); // 1回のまま（呼ばれない）
    });
  });

  it('preventDefault が true の場合に event.preventDefault が呼ばれること', async () => {
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

    await handler.handle(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('enabled が false を返す場合はハンドラーが実行されないこと', async () => {
    const callback = vi.fn();
    const handler = new KeyboardHandler(false, [
      {
        combo: { key: 'a' },
        handler: callback,
        enabled: () => false
      }
    ]);

    await handler.handle({ key: 'a' } as KeyboardEvent);
    expect(callback).not.toHaveBeenCalled();
  });
});
