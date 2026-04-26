import { success } from '@domain/common/result';
import type { AppResult } from '@domain/flac/types';
import type { FlacTrack, Picture } from '@domain/flac/models';
import type { AppError } from '@domain/flac/errors';
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

const saveTracks = async (
  tracks: FlacTrack[]
): Promise<{ successes: string[]; errors: { path: string; error: AppError }[] }> => {
  const tasks = tracks.map((track) => () => window.api.writeMetadata(track));
  const results = await pooledAll(tasks);

  const successes: string[] = [];
  const errors: { path: string; error: AppError }[] = [];

  for (const [index, result] of results.entries()) {
    const path = tracks[index].path;
    if (result.type === 'success') {
      successes.push(result.value);
    } else {
      errors.push({ path, error: result.error });
    }
  }

  return { successes, errors };
};

const pickImage = async (): Promise<AppResult<Picture | null>> => {
  return await window.api.pickImage();
};

const getImageInfo = async (path: string): Promise<AppResult<Picture>> => {
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
