/**
 * パスの種別（ファイル、ディレクトリ、または不明）
 */
export type PathType = 'file' | 'directory' | 'unknown';

/**
 * 解決されたパス情報（パス本体と種別のペア）
 */
export interface ResolvedPath {
  path: string;
  type: PathType;
}
