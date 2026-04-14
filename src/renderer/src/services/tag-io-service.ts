import { success } from '@domain/common/result';
import type { FlacTrack, Picture, TagResult } from '@domain/flac/types';

/**
 * メインプロセスとの通信（IPC）を担当するサービス。
 * インフラ層の責務として、外部の API をカプセル化します。
 * UI専用のモデル（TrackRecord）や表示用URLの生成には関知しません。
 *
 * このファイルは状態を持たない純粋な関数/オブジェクトの集まりです。
 */

/**
 * 1つのファイルに対してメタデータの読込を行います。
 */
const loadSingleTrack = async (path: string): Promise<TagResult<FlacTrack>> => {
  return await window.api.readMetadata(path);
};

/**
 * パスリストに基づきメタデータを並列読み込みし、データの配列を返します。
 */
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

/**
 * フォルダを選択し、中のFLACファイルとメタデータを読み取って返します。
 */
const scanAndLoadTracks = async (): Promise<
  TagResult<{ tracks: FlacTrack[]; isLimited: boolean } | null>
> => {
  const dirPath = await window.api.selectDirectory();
  if (!dirPath) {
    return success(null);
  }
  return await loadTracksFromPaths([dirPath]);
};

/**
 * 指定された複数のパスからFLACファイルとメタデータを読み取って返します。
 */
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

/**
 * 指定されたパスのメタデータをディスクから再読み込みします。
 */
const readMetadata = async (path: string): Promise<TagResult<FlacTrack>> => {
  return await window.api.readMetadata(path);
};

/**
 * 指定されたデータ群をディスクに保存します。
 */
const saveTracks = async (tracks: FlacTrack[]): Promise<TagResult<void>> => {
  for (const track of tracks) {
    const result = await window.api.writeMetadata(track);
    if (result.type === 'error') {
      return result;
    }
  }
  return success(undefined);
};

/**
 * 画像ファイルを選択し、メタデータ用の Picture オブジェクトを返します。
 */
const pickImage = async (): Promise<TagResult<Picture | null>> => {
  return await window.api.pickImage();
};

/**
 * タグ I/O サービスの実体。
 */
export const tagIoService = {
  scanAndLoadTracks,
  loadTracksFromPaths,
  readMetadata,
  saveTracks,
  pickImage
} as const;
