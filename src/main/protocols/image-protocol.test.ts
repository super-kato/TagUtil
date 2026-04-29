import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleImageRequest } from './image-protocol';
import { net } from 'electron';
import * as flacImageService from '@services/flac/image';
import * as fileUtils from '@main/utils/file-utils';
import { HTTP_STATUS } from '@shared/http-status';

vi.mock('@services/flac/image');
vi.mock('@main/utils/file-utils');
vi.mock('@main/infrastructure/logging/logger');

describe('image-protocol', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('handleImageRequest', () => {
    it('FLACファイルから画像を抽出して返すこと', async () => {
      const mockBuffer = new Uint8Array([1, 2, 3]);
      vi.mocked(fileUtils.isSupportedAudioFile).mockReturnValue(true);
      vi.mocked(flacImageService.extractEmbeddedImage).mockResolvedValue({
        buffer: mockBuffer,
        mime: 'image/jpeg'
      });

      const request = new Request('flac-image://path/to/music.flac');
      const response = await handleImageRequest(request);

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(response.headers.get('Content-Type')).toBe('image/jpeg');
      const body = await response.arrayBuffer();
      expect(new Uint8Array(body)).toEqual(mockBuffer);
    });

    it('FLAC以外のファイルはローカルファイルを直接読み込むこと', async () => {
      vi.mocked(fileUtils.isSupportedAudioFile).mockReturnValue(false);
      vi.mocked(net.fetch).mockResolvedValue(new Response('local content', { status: 200 }));

      const request = new Request('flac-image://path/to/image.jpg');
      const response = await handleImageRequest(request);

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(await response.text()).toBe('local content');
      expect(net.fetch).toHaveBeenCalled();
    });

    it('不正なURL形式の場合に400エラーを返すこと', async () => {
      // URL としてパースできない文字列（Requestオブジェクト作成時に検証されるが、
      // 内部関数単体の挙動確認として）
      const request = { url: 'not-a-url' } as Request;
      const response = await handleImageRequest(request);

      expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    it('パスが空の場合に400エラーを返すこと', async () => {
      const request = new Request('flac-image://');
      const response = await handleImageRequest(request);

      expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    it('画像が見つからない場合に404エラーを返すこと', async () => {
      vi.mocked(fileUtils.isSupportedAudioFile).mockReturnValue(true);
      vi.mocked(flacImageService.extractEmbeddedImage).mockResolvedValue(null);

      const request = new Request('flac-image://path/to/no-image.flac');
      const response = await handleImageRequest(request);

      expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
    });

    it('予期しないエラーが発生した場合に500エラーを返すこと', async () => {
      vi.mocked(fileUtils.isSupportedAudioFile).mockImplementation(() => {
        throw new Error('Unexpected');
      });

      const request = new Request('flac-image://path/to/error.flac');
      const response = await handleImageRequest(request);

      expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    });
  });
});
