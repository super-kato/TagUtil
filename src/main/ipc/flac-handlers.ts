import { FlacTrack } from '@domain/flac/types';
import { getImageInfo, pickImage } from '@services/flac/image';
import { readMetadata } from '@services/flac/reader';
import { renameFile } from '@services/flac/renamer';
import { scanDirectory } from '@services/flac/scanner';
import { writeMetadata } from '@services/flac/writer';
import { logger } from '@services/platform/logger';
import { IPC_CHANNELS } from '@shared/ipc';
import { ipcMain } from 'electron';

/** FLAC関連のIPCハンドラーを登録 */
export const registerFlacHandlers = (): void => {
  ipcMain.handle(IPC_CHANNELS.READ_METADATA, async (_event, filePath: string) => {
    logger.info(`Reading metadata: ${filePath}`);
    return await readMetadata(filePath);
  });

  ipcMain.handle(IPC_CHANNELS.WRITE_METADATA, async (_event, track: FlacTrack) => {
    logger.info(`Writing metadata: ${track.path}`);
    const result = await writeMetadata(track);
    if (result.type === 'success') {
      logger.info(`Successfully wrote metadata: ${track.path}`);
    } else {
      const detail = result.error.options.detail ? ` (${result.error.options.detail})` : '';
      logger.error(`Failed to write metadata: ${track.path} - ${result.error.type}${detail}`);
    }
    return result;
  });

  ipcMain.handle(IPC_CHANNELS.SCAN_DIRECTORY, async (_event, targetPaths: string[]) => {
    logger.info(`Scanning directories: ${targetPaths.join(', ')}`);
    const result = await scanDirectory(targetPaths);
    if (result.type === 'success') {
      logger.info(`Found ${result.value.paths.length} FLAC files.`);
    } else {
      const detail = result.error.options.detail ? ` (${result.error.options.detail})` : '';
      logger.error(`Scan failed: ${result.error.type}${detail}`);
    }
    return result;
  });

  ipcMain.handle(IPC_CHANNELS.PICK_IMAGE, async () => {
    logger.info('Opening image picker...');
    return await pickImage();
  });

  ipcMain.handle(IPC_CHANNELS.GET_IMAGE_INFO, async (_event, filePath: string) => {
    logger.info(`Getting image info: ${filePath}`);
    return await getImageInfo(filePath);
  });

  ipcMain.handle(IPC_CHANNELS.RENAME_FILE, async (_event, oldPath: string, newPath: string) => {
    logger.info(`Renaming file: ${oldPath} -> ${newPath}`);
    const result = await renameFile(oldPath, newPath);
    if (result.type === 'success') {
      logger.info(`Successfully renamed: ${newPath}`);
    } else {
      const detail = result.error.options.detail ? ` (${result.error.options.detail})` : '';
      logger.error(`Rename failed: ${result.error.type}${detail}`);
    }
    return result;
  });
};
