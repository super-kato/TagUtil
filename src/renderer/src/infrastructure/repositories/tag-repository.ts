import { success } from '@domain/common/result';
import type { TagResult } from '@domain/flac/types';
import type { FlacTrack, Picture } from '@domain/flac/models';
import { pooledAll } from '@renderer/utils/concurrency';

/**
 * 楽曲データ（FLACタグ）の物理的な読み書きを担当するリポジトリ。
 * Electron IPC経由でメインプロセスのサービスと通信します。
 */

const readMetadata = async (path: string): Promise<TagResult<FlacTrack>> => {
  return await window.api.readMetadata(path);
};

const loadTracksFromPaths = async (
  targetPaths: string[]
): Promise<TagResult<{ tracks: FlacTrack[]; isLimited: boolean }>> => {
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
  TagResult<{ tracks: FlacTrack[]; isLimited: boolean } | null>
> => {
  const dirPath = await window.api.selectDirectory();
  if (!dirPath) {
    return success(null);
  }
  return await loadTracksFromPaths([dirPath]);
};

const saveTracks = async (tracks: FlacTrack[]): Promise<TagResult<void>> => {
  const results = await pooledAll(tracks.map((track) => () => window.api.writeMetadata(track)));

  for (const result of results) {
    if (result.type === 'error') {
      return result;
    }
  }

  return success(undefined);
};

const pickImage = async (): Promise<TagResult<Picture | null>> => {
  return await window.api.pickImage();
};

const getImageInfo = async (path: string): Promise<TagResult<Picture>> => {
  return await window.api.getImageInfo(path);
};

export const tagRepository = {
  scanAndLoadTracks,
  loadTracksFromPaths,
  readMetadata,
  saveTracks,
  pickImage,
  getImageInfo
} as const;
