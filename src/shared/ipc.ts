import type { FlacTrack, Picture, ScanResult, TagResult } from '@domain/flac/types';
import type { Platform } from './platform';

/**
 * カスタムプロトコルのスキーム名。
 */
export const IMAGE_PROTOCOL_SCHEME = 'flac-image';

/**
 * IPC channel names used for communication between Main and Renderer processes.
 */
export const IPC_CHANNELS = {
  /** メタデータの読み取り */
  READ_METADATA: 'flac:read-metadata',
  /** メタデータの書き込み */
  WRITE_METADATA: 'flac:write-metadata',
  /** フォルダ選択ダイアログを表示 */
  SELECT_DIRECTORY: 'flac:select-directory',
  /** ディレクトリ内のFLACファイルを探索 */
  SCAN_DIRECTORY: 'flac:scan-directory',
  /** 画像ファイルを選択して読み込み */
  PICK_IMAGE: 'flac:pick-image',
  /** 指定したパスの画像情報を取得 */
  GET_IMAGE_INFO: 'flac:get-image-info',
  /** ファイルのリネーム */
  RENAME_FILE: 'flac:rename-file',
  /** 実行環境のプラットフォームを取得 */
  GET_PLATFORM: 'app:get-platform',
  /** ディレクトリ名を取得 */
  PATH_DIRNAME: 'path:dirname',
  /** パスを結合 */
  PATH_JOIN: 'path:join'
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
  /** File オブジェクトから OS 上のファイルシステムパスを取得します */
  getPathForFile: (file: File) => string;
  /** パス操作（メインプロセス経由） */
  path: {
    dirname: (path: string) => Promise<string>;
    join: (...paths: string[]) => Promise<string>;
  };
  /** 実行環境のプラットフォームを取得します */
  getPlatform: () => Promise<Platform>;
}
