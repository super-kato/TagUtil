import { FlacMetadata } from '@domain/flac/types';
import { pickImage } from '@services/flac/image';
import { readMetadata } from '@services/flac/reader';
import { scanDirectory } from '@services/flac/scanner';
import { writeMetadata } from '@services/flac/writer';
import { resolvePaths } from '@services/flac/path-resolver';
import { IPC_CHANNELS } from '@shared/ipc';
import { ipcMain } from 'electron';

/**
 * FLAC関連のIPCハンドラーを登録します。
 */
export const registerFlacHandlers = (): void => {
  // メタデータの読み取り
  ipcMain.handle(IPC_CHANNELS.READ_METADATA, async (_event, filePath: string) => {
    return await readMetadata(filePath);
  });

  // メタデータの書き込み
  ipcMain.handle(
    IPC_CHANNELS.WRITE_METADATA,
    async (_event, filePath: string, metadata: FlacMetadata) => {
      return await writeMetadata(filePath, metadata);
    }
  );

  // 指定されたディレクトリ内のFLACファイルを探索
  ipcMain.handle(IPC_CHANNELS.SCAN_DIRECTORY, async (_event, dirPath: string) => {
    return await scanDirectory(dirPath);
  });

  // 画像ファイルを選択・読み込み
  ipcMain.handle(IPC_CHANNELS.PICK_IMAGE, async () => {
    return await pickImage();
  });

  // 複数パスの種別を判定
  ipcMain.handle(IPC_CHANNELS.RESOLVE_PATHS, async (_event, targetPaths: string[]) => {
    return await resolvePaths(targetPaths);
  });
};
