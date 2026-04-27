import { FlacTrack } from '@domain/flac/models';
import { withResultLogging } from '@main/infrastructure/logging/result-logging';
import { getImageInfo, pickImage } from '@services/flac/image';
import { readMetadata } from '@services/flac/reader';
import { renameFile, resolveRenamedPath } from '@services/flac/renamer';
import { scanDirectory } from '@services/flac/scanner';
import { writeMetadata } from '@services/flac/writer';
import { IPC_CHANNELS } from '@shared/ipc';
import { ipcMain } from 'electron';

/** FLAC関連のIPCハンドラーを登録 */
export const registerFlacHandlers = (): void => {
  // メタデータの読み取り
  ipcMain.handle(IPC_CHANNELS.READ_TAG, async (_event, filePath: string) => {
    return withResultLogging(IPC_CHANNELS.READ_TAG, () => readMetadata(filePath), filePath);
  });

  // メタデータの書き込み
  ipcMain.handle(IPC_CHANNELS.WRITE_TAG, async (_event, track: FlacTrack) => {
    return withResultLogging(IPC_CHANNELS.WRITE_TAG, () => writeMetadata(track), track.path);
  });

  // ディレクトリのスキャン
  ipcMain.handle(IPC_CHANNELS.SCAN_DIR, async (_event, targetPaths: string[]) => {
    return withResultLogging(IPC_CHANNELS.SCAN_DIR, () => scanDirectory(targetPaths), targetPaths);
  });

  // 画像の選択
  ipcMain.handle(IPC_CHANNELS.PICK_IMG, async () => {
    return withResultLogging(IPC_CHANNELS.PICK_IMG, () => pickImage());
  });

  // 画像情報の取得
  ipcMain.handle(IPC_CHANNELS.IMG_INFO, async (_event, filePath: string) => {
    return withResultLogging(IPC_CHANNELS.IMG_INFO, () => getImageInfo(filePath), filePath);
  });

  // ファイルのリネーム
  ipcMain.handle(IPC_CHANNELS.RENAME, async (_event, oldPath: string, newPath: string) => {
    return withResultLogging(
      IPC_CHANNELS.RENAME,
      () => renameFile(oldPath, newPath),
      oldPath,
      newPath
    );
  });

  // 新しいパスの生成
  ipcMain.handle(IPC_CHANNELS.GEN_PATH, async (_event, track: FlacTrack) => {
    return withResultLogging(
      IPC_CHANNELS.GEN_PATH,
      async () => resolveRenamedPath(track),
      track.path
    );
  });
};
