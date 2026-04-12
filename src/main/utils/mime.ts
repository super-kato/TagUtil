import path from 'path';

/**
 * ファイルの拡張子に基づいてMIMEタイプを返します。
 * 対応していない拡張子の場合は 'application/octet-stream' を返します。
 */
export const getMimeTypeFromPath = (filePath: string): string => {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    default:
      return 'application/octet-stream';
  }
};
