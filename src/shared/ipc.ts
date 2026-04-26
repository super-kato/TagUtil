import type { LogHandler } from '@domain/common/log';
import type { FlacTrack, Picture, ScanResult, TagResult } from '@domain/flac/types';
import type { Platform } from './platform';
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
  READ_METADATA: 'tag:read-metadata',
  /** メタデータの書き込み */
  WRITE_METADATA: 'tag:write-metadata',
  /** フォルダ選択ダイアログを表示 */
  SELECT_DIRECTORY: 'app:select-directory',
  /** ディレクトリ内のFLACファイルを探索 */
  SCAN_DIRECTORY: 'tag:scan-directory',
  /** 画像ファイルを選択して読み込み */
  PICK_IMAGE: 'tag:pick-image',
  /** 指定したパスの画像情報を取得 */
  GET_IMAGE_INFO: 'tag:get-image-info',
  /** ファイルのリネーム */
  RENAME_FILE: 'tag:rename-file',
  /** メタデータに基づいた新しいパスの生成 */
  GENERATE_NEW_PATH: 'tag:generate-new-path',
  /** ログメッセージの通知 */
  ON_LOG_MESSAGE: 'app:on-log-message',
  /** 実行環境のプラットフォームを取得 */
  GET_PLATFORM: 'app:get-platform'
} as const;

export type IpcChannel = (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS];

/**
 * プロジェクト全体の IPC 通信の「契約」を定義するインターフェース。
 */
export interface IpcApi {
  /** 指定されたパスの FLAC メタデータを読み取ります */
  readMetadata: (filePath: string) => Promise<TagResult<FlacTrack>>;
  /** 指定されたパスの FLAC メタデータを書き込みます */
  writeMetadata: (track: FlacTrack) => Promise<TagResult<void>>;
  /** フォルダ選択ダイアログを表示し、選択されたパスを返します */
  selectDirectory: () => Promise<string | null>;
  /** 指定されたパス（ファイルまたはディレクトリ）内のFLACファイルのパスリストを返します */
  scanDirectory: (targetPaths: string[]) => Promise<TagResult<ScanResult>>;
  /** 画像ファイルを選択し、メタデータ用の Picture オブジェクトを返します */
  pickImage: () => Promise<TagResult<Picture | null>>;
  /** 指定したパスの画像ファイルから Picture オブジェクトを生成して返します */
  getImageInfo: (filePath: string) => Promise<TagResult<Picture>>;
  /** ファイルをリネーム（移動）します */
  renameFile: (oldPath: string, newPath: string) => Promise<TagResult<void>>;
  /** メタデータに基づいて新しいファイルパスを生成します */
  generateNewPath: (track: FlacTrack) => Promise<TagResult<string>>;
  /** File オブジェクトから OS 上のファイルシステムパスを取得します */
  getPathForFile: (file: File) => string;
  /** 実行環境のプラットフォームを取得します */
  getPlatform: () => Promise<Platform>;
  /** ログメッセージを受信した時のコールバックを登録します */
  onLogMessage: (callback: LogHandler) => Unsubscribe;
}
