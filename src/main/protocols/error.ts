/**
 * プロトコル処理専用のエラークラス
 */
export class ProtocolError extends Error {
  readonly isProtocolError = true;

  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'ProtocolError';
  }
}

/**
 * エラーオブジェクトが ProtocolError の構造を持っているか判定します（型ガード）。
 */
export const isProtocolError = (error: unknown): error is ProtocolError =>
  error !== null &&
  typeof error === 'object' &&
  'isProtocolError' in error &&
  'status' in error &&
  'message' in error;
