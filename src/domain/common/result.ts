/**
 * TypeScriptのDiscriminated Unionsを利用したResult型定義。
 * 外部ライブラリに依存せず、型安全なエラーハンドリングを実現します。
 */

export type Result<T, E> = Success<T> | Failure<E>;

export interface Success<T> {
  type: 'success';
  value: T;
}

export interface Failure<E> {
  type: 'error';
  error: E;
}

/**
 * Result型を作成するためのユーティリティ関数
 */
export const success = <T>(value: T): Success<T> => ({
  type: 'success',
  value
});

export const failure = <E>(error: E): Failure<E> => ({
  type: 'error',
  error
});
