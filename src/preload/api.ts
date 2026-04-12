import type { FlacMetadata } from '@domain/flac/types';
import type { IpcApi } from '@shared/ipc';
import { IPC_CHANNELS } from '@shared/ipc';
import { ipcRenderer, webUtils } from 'electron';

/**
 * Rendererプロセスに露出させるカスタムAPIの定義。
 * IpcApi インターフェースを実装することで、メインプロセスとの契約（Contract）を保証します。
 */
export const api: IpcApi = {
  /**
   * FLACファイルのメタデータを読み取ります。
   * @param path ファイルの絶対パス
   */
  readMetadata: (path: string) => ipcRenderer.invoke(IPC_CHANNELS.READ_METADATA, path),
  /**
   * FLACファイルのメタデータを書き込みます。
   * @param path ファイルの絶対パス
   * @param metadata 書き込むメタデータ
   */
  writeMetadata: (path: string, metadata: FlacMetadata) =>
    ipcRenderer.invoke(IPC_CHANNELS.WRITE_METADATA, path, metadata),
  /**
   * フォルダ選択ダイアログを表示します。
   */
  selectDirectory: () => ipcRenderer.invoke(IPC_CHANNELS.SELECT_DIRECTORY),
  /**
   * 指定したディレクトリ内のFLACファイルをスキャンします。
   * @param dirPath ディレクトリの絶対パス
   */
  scanDirectory: (dirPath: string) => ipcRenderer.invoke(IPC_CHANNELS.SCAN_DIRECTORY, dirPath),
  /**
   * 画像ファイルを選択し、メタデータ用の Picture オブジェクトを返します。
   */
  pickImage: () => ipcRenderer.invoke(IPC_CHANNELS.PICK_IMAGE),
  /**
   * File オブジェクトから OS 上のファイルシステムパスを取得します。
   * Electron v28+ で非推奨となった File.path の代替です。
   */
  getPathForFile: (file: File) => webUtils.getPathForFile(file),
  /**
   * 複数パスの種別（ファイル/ディレクトリ）を判定します。
   */
  resolvePaths: (targetPaths: string[]) =>
    ipcRenderer.invoke(IPC_CHANNELS.RESOLVE_PATHS, targetPaths)
};

export type Api = typeof api;
