/**
 * T が配列ならその要素型、そうでなければ T 自身（非Null）を返す。
 */
export type ElementType<T> =
  NonNullable<T> extends Array<infer U> ? NonNullable<U> : NonNullable<T>;

/**
 * アプリケーションが動作するプラットフォームの種類。
 */
export type Platform = 'mac' | 'windows' | 'linux' | 'other';
