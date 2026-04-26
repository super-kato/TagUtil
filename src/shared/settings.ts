import { TAG_PLACEHOLDERS } from './constants/placeholders';

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
  renamePattern: `${TAG_PLACEHOLDERS.TRACK_NUMBER} - ${TAG_PLACEHOLDERS.TITLE}`,
  trackNumberPadding: 2
};
