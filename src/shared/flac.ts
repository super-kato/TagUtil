/**
 * ディレクトリのスキャン結果を表すインターフェース。
 * メインプロセスとレンダラープロセスで共有されます。
 */
export interface ScanResult {
  /** 見つかったファイルの絶対パス一覧 */
  paths: string[];
  /** 上限に達してスキャンが打ち切られたかどうか */
  isLimited: boolean;
}
