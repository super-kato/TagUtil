import type { Picture } from '@domain/flac/models';
import { IMAGE_PROTOCOL_SCHEME } from '@shared/ipc';

/**
 * 読み込み用のアートワークURLを生成します。
 *
 * この関数は実際のバイナリデータを返さず、カスタムプロトコル (flac-image://) 形式の
 * URLを生成します。画像はプレースホルダーとして img タグの src に渡され、
 * メインプロセスから必要な時にだけオンデマンドで配信されます。
 *
 * @param picture アートワーク情報 (dataを持たない)
 * @returns カスタムプロトコル形式のURL
 */
export const createImageUrl = (picture?: Picture | null): string | null => {
  if (!picture || !picture.sourcePath) {
    return null;
  }
  // 絶対パスを（大文字小文字を含め）そのまま維持できるよう、
  // 3本スラッシュ形式 (flac-image:///path/to/file) の URL を生成します。
  // 特殊文字（#や?など）をエスケープするため encodeURI を使用します。
  return `${IMAGE_PROTOCOL_SCHEME}://${encodeURI(picture.sourcePath)}`;
};
