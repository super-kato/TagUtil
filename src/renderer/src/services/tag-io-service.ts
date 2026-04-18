import { success } from '@domain/common/result';
import type { FlacTrack, Picture, TagResult } from '@domain/flac/types';

/**
 * メインプロセス（Electron IPC）との通信を担当するサービス。
 */

const loadSingleTrack = async (path: string): Promise<TagResult<FlacTrack>> => {
  return await window.api.readMetadata(path);
};

const loadTracksFromFiles = async (filePaths: string[]): Promise<FlacTrack[]> => {
  const loadPromises = filePaths.map((path) => loadSingleTrack(path));
  const results = await Promise.all(loadPromises);

  const tracks: FlacTrack[] = [];
  for (const result of results) {
    if (result.type === 'success') {
      tracks.push(result.value);
    }
  }
  return tracks;
};

const scanAndLoadTracks = async (): Promise<
  TagResult<{ tracks: FlacTrack[]; isLimited: boolean } | null>
> => {
  const dirPath = await window.api.selectDirectory();
  if (!dirPath) {
    return success(null);
  }
  return await loadTracksFromPaths([dirPath]);
};

const loadTracksFromPaths = async (
  targetPaths: string[]
): Promise<TagResult<{ tracks: FlacTrack[]; isLimited: boolean }>> => {
  const scanResult = await window.api.scanDirectory(targetPaths);
  if (scanResult.type === 'error') {
    return scanResult;
  }

  const { paths: filePaths, isLimited } = scanResult.value;
  const tracks = await loadTracksFromFiles(filePaths);

  return success({ tracks, isLimited });
};

const readMetadata = async (path: string): Promise<TagResult<FlacTrack>> => {
  return await window.api.readMetadata(path);
};

const saveTracks = async (tracks: FlacTrack[]): Promise<TagResult<void>> => {
  for (const track of tracks) {
    const result = await window.api.writeMetadata(track);
    if (result.type === 'error') {
      return result;
    }
  }
  return success(undefined);
};

const pickImage = async (): Promise<TagResult<Picture | null>> => {
  return await window.api.pickImage();
};

export const tagIoService = {
  scanAndLoadTracks,
  loadTracksFromPaths,
  readMetadata,
  saveTracks,
  pickImage
} as const;
