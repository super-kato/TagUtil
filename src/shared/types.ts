/**
 * T が配列ならその要素型、そうでなければ T 自身（非Null）を返す。
 */
export type ElementType<T> =
  NonNullable<T> extends Array<infer U> ? NonNullable<U> : NonNullable<T>;

/**
 * 購読解除を行う関数の型。
 */
export type Unsubscribe = () => void;
