import { FlacTrack } from '@domain/flac/types';
import { getImageInfo, pickImage } from '@services/flac/image';
import { readMetadata } from '@services/flac/reader';
import { renameFile } from '@services/flac/renamer';
import { scanDirectory } from '@services/flac/scanner';
import { writeMetadata } from '@services/flac/writer';
import { IPC_CHANNELS } from '@shared/ipc';
import { ipcMain } from 'electron';
import { withResultLogging } from './handler-utils';

/** FLAC関連のIPCハンドラーを登録 */
export const registerFlacHandlers = (): void => {
  // メタデータの読み取り
  ipcMain.handle(IPC_CHANNELS.READ_METADATA, async (_event, filePath: string) => {
    return withResultLogging(IPC_CHANNELS.READ_METADATA, () => readMetadata(filePath), filePath);
  });

  // メタデータの書き込み
  ipcMain.handle(IPC_CHANNELS.WRITE_METADATA, async (_event, track: FlacTrack) => {
    return withResultLogging(IPC_CHANNELS.WRITE_METADATA, () => writeMetadata(track), track.path);
  });

  // ディレクトリのスキャン
  ipcMain.handle(IPC_CHANNELS.SCAN_DIRECTORY, async (_event, targetPaths: string[]) => {
    return withResultLogging(
      IPC_CHANNELS.SCAN_DIRECTORY,
      () => scanDirectory(targetPaths),
      targetPaths.join(', ')
    );
  });

  // 画像の選択
  ipcMain.handle(IPC_CHANNELS.PICK_IMAGE, async () => {
    return withResultLogging(IPC_CHANNELS.PICK_IMAGE, () => pickImage());
  });

  // 画像情報の取得
  ipcMain.handle(IPC_CHANNELS.GET_IMAGE_INFO, async (_event, filePath: string) => {
    return withResultLogging(IPC_CHANNELS.GET_IMAGE_INFO, () => getImageInfo(filePath), filePath);
  });

  // ファイルのリネーム
  ipcMain.handle(IPC_CHANNELS.RENAME_FILE, async (_event, oldPath: string, newPath: string) => {
    return withResultLogging(
      IPC_CHANNELS.RENAME_FILE,
      () => renameFile(oldPath, newPath),
      `${oldPath} -> ${newPath}`
    );
  });
};
