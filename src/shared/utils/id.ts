/**
 * 一意な識別子（UUID v4）を生成します。
 * 実行環境（Node.js / ブラウザ）の標準 crypto API を使用します。
 * @returns UUID 文字列
 */
export const generateId = (): string => {
  return crypto.randomUUID();
};
