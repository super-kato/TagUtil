export type ColorTheme = 'light' | 'dark';

/**
 * アプリケーションのユーザー設定の型定義。
 */
export interface AppSettings {
  /** ファイルのリネーム規則（例: "{trackNumber} - {title}"） */
  renamePattern: string;
  /** トラック番号のパディング桁数 */
  trackNumberPadding: number;
  /** カラーテーマ */
  theme: ColorTheme;
  /** ジャンル一覧 */
  genres: string[];
  /** クイックジャンルボタンの設定（表示するジャンル名） */
  quickGenres: string[];
}
