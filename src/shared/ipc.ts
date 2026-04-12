import type { FlacMetadata, Picture, ScanResult, TagResult } from '@domain/flac/types';
import { ResolvedPath } from '@domain/common/system';

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
  /** パスの一覧に対して種別（ファイル/ディレクトリ）を判定 */
  RESOLVE_PATHS: 'flac:resolve-paths'
} as const;

export type IpcChannel = (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS];

/**
 * プロジェクト全体の IPC 通信の「契約」を定義するインターフェース。
 */
export interface IpcApi {
  /** 指定されたパスの FLAC メタデータを読み取ります */
  readMetadata: (filePath: string) => Promise<TagResult<FlacMetadata>>;
  /** 指定されたパスの FLAC メタデータを書き込みます */
  writeMetadata: (filePath: string, metadata: FlacMetadata) => Promise<TagResult<void>>;
  /** フォルダ選択ダイアログを表示し、選択されたパスを返します */
  selectDirectory: () => Promise<string | null>;
  /** 指定されたディレクトリ内のFLACファイルのパスリストを返します */
  scanDirectory: (dirPath: string) => Promise<TagResult<ScanResult>>;
  /** 画像ファイルを選択し、メタデータ用の Picture オブジェクトを返します */
  pickImage: () => Promise<TagResult<Picture | null>>;
  /** File オブジェクトから OS 上のファイルシステムパスを取得します */
  getPathForFile: (file: File) => string;
  /** 複数パスの種別を判定します */
  resolvePaths: (targetPaths: string[]) => Promise<ResolvedPath[]>;
}
