import type { LogHandler } from '@domain/common/log';
import type { FlacTrack, Picture } from '@domain/flac/models';
import type { AppResult, ScanResult } from '@domain/flac/types';
import type { Platform } from './platform';
import type { AppSettings } from './settings';
import type { Unsubscribe } from './types';

/**
 * カスタムプロトコルのスキーム名。
 */
export const IMAGE_PROTOCOL_SCHEME = 'flac-image';

/**
 * IPC channel names used for communication between Main and Renderer processes.
 */
export const IPC_CHANNELS = {
  /** メタデータの読み取り */
  READ_TAG: 'tag:read-tag',
  /** メタデータの書き込み */
  WRITE_TAG: 'tag:write-tag',
  /** フォルダ選択ダイアログを表示 */
  SELECT_DIR: 'app:select-dir',
  /** ディレクトリ内のFLACファイルを探索 */
  SCAN_DIR: 'tag:scan-dir',
  /** 画像ファイルを選択して読み込み */
  PICK_IMG: 'tag:pick-img',
  /** 指定したパスの画像情報を取得 */
  IMG_INFO: 'tag:img-info',
  /** ファイルのリネーム */
  RENAME: 'tag:rename',
  /** メタデータに基づいた新しいパスの生成 */
  GEN_PATH: 'tag:gen-path',
  /** ログメッセージの通知 */
  ON_LOG: 'app:on-log',
  /** 実行環境のプラットフォームを取得 */
  PLATFORM: 'app:platform',
  /** アプリケーション設定の取得 */
  GET_CONFIG: 'app:get-config',
  /** アプリケーション設定の更新 */
  UPDATE_CONFIG: 'app:update-config',
  /** メインウィンドウを表示 */
  SHOW_MAIN: 'app:show-main',
  /** トラックのコンテキストメニューを表示 */
  SHOW_TRACK_CONTEXT_MENU: 'app:show-track-context-menu'
} as const;

export type IpcChannel = (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS];

/**
 * IpcApi インターフェースの定義。
 * メインプロセスとレンダラープロセスの間での型安全な通信を保証します。
 */
export interface IpcApi {
  readMetadata(path: string): Promise<AppResult<FlacTrack>>;
  writeMetadata(track: FlacTrack): Promise<AppResult<void>>;
  selectDirectory(): Promise<string | undefined>;
  scanDirectory(targetPaths: string[]): Promise<ScanResult>;
  pickImage(): Promise<Picture | undefined>;
  getImageInfo(path: string): Promise<Picture | undefined>;
  renameFile(oldPath: string, newPath: string): Promise<AppResult<void>>;
  generateNewPath(track: FlacTrack): Promise<string>;
  getPathForFile(file: File): string;
  getPlatform(): Promise<Platform>;
  getSettings(): Promise<AppResult<AppSettings>>;
  updateSettings(settings: Partial<AppSettings>): Promise<AppResult<void>>;
  showMainWindow(): Promise<void>;
  showTrackContextMenu(path: string): Promise<void>;
  onLogMessage(callback: LogHandler): Unsubscribe;
}

declare global {
  interface Window {
    api: IpcApi;
  }
}
