import type { Result } from '@domain/common/result';
import type { AppError } from './errors';

/**
 * ディレクトリのスキャン結果を表すインターフェース。
 */
export interface ScanResult {
  /** 見つかったファイルの絶対パス一覧 */
  paths: string[];
  /** 上限に達してスキャンが打ち切られたかどうか */
  isLimited: boolean;
}

/**
 * アプリケーションの各操作の戻り値型。
 * Result型を利用した、例外を投げないエラーハンドリングを強制します。
 */
export type AppResult<T> = Result<T, AppError>;
