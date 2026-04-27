import type { Result } from '@domain/common/result';
import type { AppError } from './errors';

/**
 * アプリケーションの各操作の戻り値型。
 * Result型を利用した、例外を投げないエラーハンドリングを強制します。
 */
export type AppResult<T> = Result<T, AppError>;
