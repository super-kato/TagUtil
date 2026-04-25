import { FlacTrack } from '@domain/flac/types';
import { getImageInfo, pickImage } from '@services/flac/image';
import { readMetadata } from '@services/flac/reader';
import { renameFile } from '@services/flac/renamer';
import { scanDirectory } from '@services/flac/scanner';
import { writeMetadata } from '@services/flac/writer';
import { IPC_CHANNELS } from '@shared/ipc';
import { handleWithLogging } from './handler-utils';

/** FLAC関連のIPCハンドラーを登録 */
export const registerFlacHandlers = (): void => {
  handleWithLogging(IPC_CHANNELS.READ_METADATA, async (_event, filePath: string) => {
    return await readMetadata(filePath);
  });

  handleWithLogging(IPC_CHANNELS.WRITE_METADATA, async (_event, track: FlacTrack) => {
    return await writeMetadata(track);
  });

  handleWithLogging(IPC_CHANNELS.SCAN_DIRECTORY, async (_event, targetPaths: string[]) => {
    return await scanDirectory(targetPaths);
  });

  handleWithLogging(IPC_CHANNELS.PICK_IMAGE, async () => {
    return await pickImage();
  });

  handleWithLogging(IPC_CHANNELS.GET_IMAGE_INFO, async (_event, filePath: string) => {
    return await getImageInfo(filePath);
  });

  handleWithLogging(IPC_CHANNELS.RENAME_FILE, async (_event, oldPath: string, newPath: string) => {
    return await renameFile(oldPath, newPath);
  });
};
