import { HTTP_STATUS } from '@shared/http-status';
import { net } from 'electron';
import path from 'node:path';
import { pathToFileURL } from 'url';
import { extractEmbeddedImage } from '@main/services/flac/image';
import { isSupportedAudioFile } from '@main/utils/file-utils';
import { ProtocolError, isProtocolError } from './error';

/**
 * 画像リクエストを処理し、適切な Response を返します。
 * この関数は Electron API に依存しないため、単体テストが可能です。
 *
 * @param request 読み込みリクエスト (flac-image://path/to/file?ts=...)
 * @returns 画像バイナリまたはエラー情報を含む Response
 */
export const handleImageRequest = async (request: Request): Promise<Response> => {
  try {
    const filePath = parseProtocolUrl(request.url);

    // オーディオファイル（FLAC等）の場合: 埋め込み画像を抽出
    if (isSupportedAudioFile(filePath)) {
      return await serveEmbeddedImage(filePath);
    }

    // それ以外の場合（外部画像ファイル等）: ローカルファイルを直接配信
    return await serveLocalFile(filePath);
  } catch (error: unknown) {
    console.error(`[Protocol] Error serving ${request.url}:`, error);
    return toErrorResponse(error);
  }
};

/**
 * カスタムプロトコルのURLをパースし、安全なローカルファイルパスを返します。
 *
 * @param requestUrl リクエストURL (flac-image://...)
 * @returns 正規化された絶対パス
 * @throws ProtocolError パスが無効な場合
 */
const parseProtocolUrl = (requestUrl: string): string => {
  let url: URL;
  try {
    url = new URL(requestUrl);
  } catch {
    throw new ProtocolError('Invalid URL format', HTTP_STATUS.BAD_REQUEST);
  }

  // ホスト部分（もしあれば）とパス部分を結合して絶対パスを復元する
  // (flac-image://host/path -> host/path, flac-image:///path -> /path)
  const fullPath = url.host + url.pathname;
  const decodedPath = decodeURIComponent(fullPath);

  // 絶対パスとして正規化
  const filePath = path.resolve('/', decodedPath);

  if (!filePath || filePath === '/') {
    throw new ProtocolError('File path is required', HTTP_STATUS.BAD_REQUEST);
  }

  return filePath;
};

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
