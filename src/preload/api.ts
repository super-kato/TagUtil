import type { LogHandler, LogMessage } from '@domain/common/log';

import type { FlacTrack } from '@domain/flac/models';
import type { IpcApi } from '@shared/ipc';
import { IPC_CHANNELS } from '@shared/ipc';
import type { AppSettings } from '@shared/settings';
import { ipcRenderer, IpcRendererEvent, webUtils } from 'electron';

/**
 * Rendererプロセスに露出させるカスタムAPIの定義。
 * IpcApi インターフェースを実装することで、メインプロセスとの契約（Contract）を保証します。
 */
export const api: IpcApi = {
  /**
   * FLACファイルのメタデータを読み取ります。
   * @param path ファイルの絶対パス
   */
  readMetadata: (path: string) => ipcRenderer.invoke(IPC_CHANNELS.READ_TAG, path),
  /**
   * FLACファイルのメタデータを書き込みます。
   * @param track 書き込むトラック情報（パスとメタデータ）
   */
  writeMetadata: (track: FlacTrack) => ipcRenderer.invoke(IPC_CHANNELS.WRITE_TAG, track),
  /**
   * フォルダ選択ダイアログを表示します。
   */
  selectDirectory: () => ipcRenderer.invoke(IPC_CHANNELS.SELECT_DIR),
  /**
   * 指定したパス（ファイルまたはディレクトリ）内のFLACファイルをスキャンします。
   * @param targetPaths ファイルまたはディレクトリの絶対パスの配列
   */
  scanDirectory: (targetPaths: string[]) => ipcRenderer.invoke(IPC_CHANNELS.SCAN_DIR, targetPaths),
  /**
   * 画像ファイルを選択し、メタデータ用の Picture オブジェクトを返します。
   */
  pickImage: () => ipcRenderer.invoke(IPC_CHANNELS.PICK_IMG),
  /**
   * 指定したパスの画像情報を取得します。
   * @param path 画像ファイルの絶対パス
   */
  getImageInfo: (path: string) => ipcRenderer.invoke(IPC_CHANNELS.IMG_INFO, path),
  /**
   * ファイルをリネーム（移動）します。
   * @param oldPath 現在のパス
   * @param newPath 新しいパス
   */
  renameFile: (oldPath: string, newPath: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.RENAME, oldPath, newPath),
  /**
   * メタデータに基づいて新しいファイルパスを生成します。
   * @param track トラック情報
   */
  generateNewPath: (track: FlacTrack) => ipcRenderer.invoke(IPC_CHANNELS.GEN_PATH, track),
  /**
   * File オブジェクトから OS 上のファイルシステムパスを取得します。
   * Electron v28+ で非推奨となった File.path の代替です。
   */
  getPathForFile: (file: File) => webUtils.getPathForFile(file),
  getPlatform: () => ipcRenderer.invoke(IPC_CHANNELS.PLATFORM),
  /**
   * アプリケーション設定を取得します。
   */
  getSettings: () => ipcRenderer.invoke(IPC_CHANNELS.GET_CONFIG),
  /**
   * アプリケーション設定を更新します。
   * @param settings 更新する設定のサブセット
   */
  updateSettings: (settings: Partial<AppSettings>) =>
    ipcRenderer.invoke(IPC_CHANNELS.UPDATE_CONFIG, settings),
  /**
   * メインウィンドウを表示します。
   */
  showMainWindow: () => ipcRenderer.invoke(IPC_CHANNELS.SHOW_MAIN),
  /**
   * ログメッセージを受信した時のコールバックを登録します。
   * @param callback ログメッセージを受け取るコールバック
   * @returns 登録解除用の関数
   */
  onLogMessage: (callback: LogHandler) => {
    const subscription = (_: IpcRendererEvent, message: LogMessage): void => callback(message);
    ipcRenderer.on(IPC_CHANNELS.ON_LOG, subscription);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.ON_LOG, subscription);
  }
};

export type Api = typeof api;
