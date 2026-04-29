/**
 * 標準的な HTTP ステータスコードの定義。
 * カスタムプロトコルや API 通信のエラーハンドリングで使用します。
 */
export const HTTP_STATUS = {
  /** 200: 成功 */
  OK: 200,
  /** 400: 不正確なリクエスト（パスの欠落など） */
  BAD_REQUEST: 400,
  /** 404: リソースが見つからない（ファイル不在など） */
  NOT_FOUND: 404,
  /** 500: サーバー内部エラー（予期しない例外） */
  INTERNAL_SERVER_ERROR: 500
} as const;

export type HttpStatus = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];
