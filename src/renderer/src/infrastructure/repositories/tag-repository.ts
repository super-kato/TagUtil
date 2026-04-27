import { success } from '@domain/common/result';
import type { FlacTrack, Picture } from '@domain/flac/models';
import type { AppResult } from '@domain/flac/types';
import { pooledAll } from '@renderer/utils/concurrency';

/**
 * 楽曲データ（FLACタグ）の物理的な読み書きを担当するリポジトリ。
 * Electron IPC経由でメインプロセスのサービスと通信します。
 */

const readMetadata = async (path: string): Promise<AppResult<FlacTrack>> => {
  return await window.api.readMetadata(path);
};

const loadTracksFromPaths = async (
  targetPaths: string[]
): Promise<AppResult<{ tracks: FlacTrack[]; isLimited: boolean }>> => {
  const scanResult = await window.api.scanDirectory(targetPaths);
  if (scanResult.type === 'error') {
    return scanResult;
  }

  const { paths: filePaths, isLimited } = scanResult.value;

  const results = await pooledAll(filePaths.map((path) => () => readMetadata(path)));

  const tracks: FlacTrack[] = [];
  for (const result of results) {
    if (result.type === 'success') {
      tracks.push(result.value);
    }
  }

  return success({ tracks, isLimited });
};

const scanAndLoadTracks = async (): Promise<
  AppResult<{ tracks: FlacTrack[]; isLimited: boolean } | null>
> => {
  const dirPath = await window.api.selectDirectory();
  if (!dirPath) {
    return success(null);
  }
  return await loadTracksFromPaths([dirPath]);
};

const saveTracks = async (tracks: FlacTrack[]): Promise<string[]> => {
  const tasks = tracks.map((track) => () => window.api.writeMetadata(track));
  const results = await pooledAll(tasks);
  return results.filter((x) => x.type === 'success').map((x) => x.value);
};

const pickImage = async (): Promise<AppResult<Picture | null>> => {
  return await window.api.pickImage();
};

const getImageInfo = async (path: string): Promise<AppResult<Picture>> => {
  return await window.api.getImageInfo(path);
};

const showTrackContextMenu = async (path: string): Promise<void> => {
  await window.api.showTrackContextMenu(path);
};

export const tagRepository = {
  scanAndLoadTracks,
  loadTracksFromPaths,
  readMetadata,
  saveTracks,
  pickImage,
  getImageInfo,
  showTrackContextMenu
} as const;
