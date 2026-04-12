import { HTTP_STATUS } from '@shared/http-status';
import { IMAGE_PROTOCOL_SCHEME } from '@shared/ipc';
import { net, protocol } from 'electron';
import path from 'node:path';
import { pathToFileURL } from 'url';
import { extractEmbeddedImage } from '../flac/image';

/**
 * プロトコル処理専用のエラークラス
 */
class ProtocolError extends Error {
  readonly isProtocolError = true;

  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'ProtocolError';
  }
}

/**
 * カスタムプロトコル (flac-image://) のリクエストを処理します。
 *
 * この関数は、レンダラーからのリクエストに応じてその場でFLACファイルを解析し、
 * ジャケット画像のバイナリを抽出して応答します。これにより、初期スキャン時の
 * IPC通信から巨大なバイナリデータを排除し、大幅な軽量化を実現しています。
 *
 * @param request 読み込みリクエスト (flac-image://path/to/file?ts=...)
 * @returns 画像バイナリを含む Response
 */
export const registerImageProtocol = (): void => {
  protocol.handle(IMAGE_PROTOCOL_SCHEME, async (request) => {
    try {
      // 1. スキーム部分 (flac-image://) を正規表現で取り除き、デコードして絶対パスを復元する。
      const rawPath = request.url.replace(new RegExp(`^${IMAGE_PROTOCOL_SCHEME}://`), '');
      const decoded = decodeURIComponent(rawPath);
      // 先頭のスラッシュが欠落していても path.resolve('/') が補完し、
      // Windows のドライブレターなども正しくハンドルされる。
      const filePath = path.resolve('/', decoded);

      if (!filePath) {
        throw new ProtocolError('File path is required', HTTP_STATUS.BAD_REQUEST);
      }
      // FLACファイルの場合: 埋め込み画像を抽出
      if (isFlacFile(filePath)) {
        return await serveEmbeddedImage(filePath);
      }
      // それ以外の場合: ローカルファイルを直接配信
      return await serveLocalFile(filePath);
    } catch (error: unknown) {
      console.error(`[Protocol] Error serving ${request.url}:`, error);
      return toErrorResponse(error);
    }
  });
};

/**
 * .flac 拡張子かどうかを判定します。
 */
const isFlacFile = (filePath: string): boolean => {
  return filePath.toLowerCase().endsWith('.flac');
};

/**
 * エラーオブジェクトが ProtocolError の構造を持っているか判定します（型ガード）。
 */
const isProtocolError = (error: unknown): error is ProtocolError =>
  error !== null &&
  typeof error === 'object' &&
  'isProtocolError' in error &&
  'status' in error &&
  'message' in error;

/**
 * エラーオブジェクトを適切な Response に変換します。
 */
const toErrorResponse = (error: unknown): Response => {
  if (isProtocolError(error)) {
    return new Response(error.message, { status: error.status });
  }

  console.error('[Protocol] Unexpected error:', error);
  return new Response('Internal Server Error', { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
};

/**
 * FLACファイルから埋め込み画像を抽出し、Responseを生成します。
 */
const serveEmbeddedImage = async (filePath: string): Promise<Response> => {
  const result = await extractEmbeddedImage(filePath);

  if (!result) {
    throw new ProtocolError('No picture found in FLAC', HTTP_STATUS.NOT_FOUND);
  }

  const headers = new Headers();
  headers.set('Content-Type', result.mime);
  headers.set('Cache-Control', 'no-store');

  return new Response(Buffer.from(result.buffer), { headers });
};

/**
 * ローカルの画像ファイルを直接配信します。
 */
const serveLocalFile = async (filePath: string): Promise<Response> => {
  const fileUrl = pathToFileURL(filePath).toString();
  const response = await net.fetch(fileUrl);

  if (!response.ok) {
    throw new ProtocolError(`Failed to fetch local file: ${response.statusText}`, response.status);
  }

  return response;
};
