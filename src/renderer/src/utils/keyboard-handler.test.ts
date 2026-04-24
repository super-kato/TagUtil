import { describe, it, expect, vi } from 'vitest';
import { KeyboardHandler } from './keyboard-handler';

describe('KeyboardHandler', () => {
  it('登録されたキーが押された時にハンドラーが実行されること', async () => {
    const callback = vi.fn();
    const handler = new KeyboardHandler(
      false,
      [
        {
          combo: { key: 'a' },
          handler: callback
        }
      ],
      () => false
    );

    const event = { key: 'a' } as KeyboardEvent;
    await handler.handle(event);

    expect(callback).toHaveBeenCalled();
  });

  it('大文字小文字を区別せずに判定すること', async () => {
    const callback = vi.fn();
    const handler = new KeyboardHandler(
      false,
      [
        {
          combo: { key: 'a' },
          handler: callback
        }
      ],
      () => false
    );

    const event = { key: 'A' } as KeyboardEvent;
    await handler.handle(event);

    expect(callback).toHaveBeenCalled();
  });

  describe('modキーの判定', () => {
    it('useMetaAsMod が true の環境では mod は Meta キーとして扱われること', async () => {
      const callback = vi.fn();
      const handler = new KeyboardHandler(
        true,
        [
          {
            combo: { key: 's', mod: true },
            handler: callback
          }
        ],
        () => false
      );

      // Meta+S
      await handler.handle({ key: 's', metaKey: true, ctrlKey: false } as KeyboardEvent);
      expect(callback).toHaveBeenCalledTimes(1);

      // Ctrl+S (不一致)
      await handler.handle({ key: 's', metaKey: false, ctrlKey: true } as KeyboardEvent);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('useMetaAsMod が false の環境では mod は Ctrl キーとして扱われること', async () => {
      const callback = vi.fn();
      const handler = new KeyboardHandler(
        false,
        [
          {
            combo: { key: 's', mod: true },
            handler: callback
          }
        ],
        () => false
      );

      // Ctrl+S
      await handler.handle({ key: 's', metaKey: false, ctrlKey: true } as KeyboardEvent);
      expect(callback).toHaveBeenCalledTimes(1);

      // Meta+S (不一致)
      await handler.handle({ key: 's', metaKey: true, ctrlKey: false } as KeyboardEvent);
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  it('preventDefault が true の場合に event.preventDefault が呼ばれること', async () => {
    const event = {
      key: 'a',
      preventDefault: vi.fn()
    } as unknown as KeyboardEvent;

    const handler = new KeyboardHandler(
      false,
      [
        {
          combo: { key: 'a' },
          handler: vi.fn(),
          preventDefault: true
        }
      ],
      () => false
    );

    await handler.handle(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('enabled が false を返す場合はハンドラーが実行されないこと', async () => {
    const callback = vi.fn();
    const handler = new KeyboardHandler(
      false,
      [
        {
          combo: { key: 'a' },
          handler: callback,
          enabled: () => false
        }
      ],
      () => false
    );

    await handler.handle({ key: 'a' } as KeyboardEvent);
    expect(callback).not.toHaveBeenCalled();
  });
});
