/**
 * アプリケーションのユーザー設定の型定義。
 */
export interface AppSettings {
  /** ファイルのリネーム規則（例: "{trackNumber} - {title}"） */
  renamePattern: string;
  /** トラック番号のパディング桁数 */
  trackNumberPadding: number;
}

/**
 * デフォルトの設定値。
 */
export const DEFAULT_SETTINGS: AppSettings = {
  renamePattern: '{trackNumber} - {title}',
  trackNumberPadding: 2
};
