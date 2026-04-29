import { describe, it, expect, vi, beforeEach } from 'vitest';
import { extractEmbeddedImage, getImageInfo, pickImage } from './image';
import * as flacReadRepo from '@main/infrastructure/repositories/flac/flac-read-repository';
import * as fileReadRepo from '@main/infrastructure/repositories/file/file-read-repository';
import * as dialog from '@main/infrastructure/platform/dialog';
import { RawFlacData } from '@main/infrastructure/repositories/repository-types';

vi.mock('@main/infrastructure/repositories/flac/flac-read-repository');
vi.mock('@main/infrastructure/repositories/file/file-read-repository');
vi.mock('@main/infrastructure/platform/dialog');
vi.mock('@main/infrastructure/logging/logger');

describe('image', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const emptyFormat = {};
  const emptyTags = {};

  describe('extractEmbeddedImage', () => {
    it('画像が埋め込まれている場合、バッファとMIMEタイプを返すこと', async () => {
      const mockBuffer = new Uint8Array([1, 2, 3]);
      const mockData: RawFlacData = {
        path: '/path/to/file.flac',
        audioFormat: emptyFormat,
        tags: emptyTags,
        pictures: [{ buffer: mockBuffer, mime: 'image/png', hash: 'mock-hash' }]
      };
      vi.mocked(flacReadRepo.readRawFlacData).mockResolvedValue(mockData);

      const result = await extractEmbeddedImage('/path/to/file.flac');

      expect(result).toEqual({
        buffer: mockBuffer,
        mime: 'image/png'
      });
    });

    it('画像が埋め込まれていない場合、nullを返すこと', async () => {
      const mockData: RawFlacData = {
        path: '/path/to/file.flac',
        audioFormat: emptyFormat,
        tags: emptyTags,
        pictures: []
      };
      vi.mocked(flacReadRepo.readRawFlacData).mockResolvedValue(mockData);

      const result = await extractEmbeddedImage('/path/to/file.flac');

      expect(result).toBeNull();
    });
  });

  describe('getImageInfo', () => {
    it('画像ファイルから情報を取得できること', async () => {
      vi.mocked(fileReadRepo.readFileWithHash).mockResolvedValue({
        buffer: new Uint8Array(),
        hash: 'abc'
      });

      const result = await getImageInfo('/path/to/image.jpg');

      expect(result.type).toBe('success');
      if (result.type === 'success') {
        expect(result.value).toEqual({
          format: 'image/jpeg',
          sourcePath: '/path/to/image.jpg',
          hash: 'abc'
        });
      }
    });
  });

  describe('pickImage', () => {
    it('ダイアログで画像が選択された場合、その情報を返すこと', async () => {
      vi.mocked(dialog.pickImageFile).mockResolvedValue('/path/to/selected.png');
      vi.mocked(fileReadRepo.readFileWithHash).mockResolvedValue({
        buffer: new Uint8Array(),
        hash: 'hash123'
      });

      const result = await pickImage();

      expect(result.type).toBe('success');
      if (result.type === 'success' && result.value) {
        expect(result.value.sourcePath).toBe('/path/to/selected.png');
        expect(result.value.hash).toBe('hash123');
      }
    });

    it('ダイアログがキャンセルされた場合、nullを返すこと', async () => {
      vi.mocked(dialog.pickImageFile).mockResolvedValue(null);

      const result = await pickImage();

      expect(result.type).toBe('success');
      if (result.type === 'success') {
        expect(result.value).toBeNull();
      }
    });
  });
});
