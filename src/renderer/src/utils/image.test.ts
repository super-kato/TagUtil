import { describe, it, expect } from 'vitest';
import { createImageUrl } from './image';
import { IMAGE_PROTOCOL_SCHEME } from '@shared/ipc';
import type { Picture } from '@domain/flac/types';

describe('createImageUrl', () => {
  it('正しい Picture オブジェクトからカスタムプロトコルURLを生成すること', () => {
    const picture: Picture = {
      sourcePath: '/path/to/image.jpg',
      format: 'image/jpeg',
      hash: 'mock-hash'
    };
    const url = createImageUrl(picture);
    expect(url).toBe(`${IMAGE_PROTOCOL_SCHEME}:///path/to/image.jpg`);
  });

  it('picture が null の場合は null を返すこと', () => {
    expect(createImageUrl(null)).toBeNull();
  });

  it('picture が undefined の場合は null を返すこと', () => {
    expect(createImageUrl(undefined)).toBeNull();
  });

  it('sourcePath が欠落している場合は null を返すこと', () => {
    const picture = {
      format: 'image/jpeg'
    } as Partial<Picture>;
    expect(createImageUrl(picture as Picture)).toBeNull();
  });

  it('sourcePath が空文字列の場合は null を返すこと', () => {
    const picture: Picture = {
      sourcePath: '',
      format: 'image/jpeg',
      hash: 'mock-hash'
    };
    expect(createImageUrl(picture)).toBeNull();
  });
});
