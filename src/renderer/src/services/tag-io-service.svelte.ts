import { success } from '@domain/common/result';
import type { Picture, TagResult } from '@domain/flac/types';
import { createImageUrl } from '@renderer/utils/image';
import type { TrackRecord } from '../stores/types';

/**
 * メインプロセスとの通信（IPC）を担当するサービス。
 * インフラ層の責務として、外部の API をカプセル化します。
 */
class TagIoService {
  /**
   * フォルダを選択し、中のFLACファイルとメタデータを読み込んで TrackRecord[] として返します。
   */
  async scanAndLoadTracks(): Promise<
    TagResult<{ tracks: TrackRecord[]; isLimited: boolean } | null>
  > {
    const dirPath = await window.api.selectDirectory();
    if (!dirPath) {
      return success(null);
    }

    return await this.loadTracksFromPaths([dirPath]);
  }

  /**
   * 指定された複数のパスからFLACファイルとメタデータを読み込んで TrackRecord[] として返します。
   */
  async loadTracksFromPaths(
    targetPaths: string[]
  ): Promise<TagResult<{ tracks: TrackRecord[]; isLimited: boolean }>> {
    const { filePaths, isLimited } = await this.collectFilePaths(targetPaths);
    const tracks = await this.loadTracksFromFiles(filePaths);

    return success({ tracks, isLimited });
  }

  /**
   * 与えられたパス（ファイルまたはディレクトリ）から FLAC ファイルのパスを一括収集します。
   */
  private async collectFilePaths(
    targetPaths: string[]
  ): Promise<{ filePaths: string[]; isLimited: boolean }> {
    const resolvedPaths = await window.api.resolvePaths(targetPaths);
    const allFilePaths: string[] = [];
    let isLimited = false;

    for (const item of resolvedPaths) {
      if (item.type === 'unknown') {
        continue;
      }
      if (item.type === 'file') {
        allFilePaths.push(item.path);
        continue;
      }
      const scanResult = await window.api.scanDirectory(item.path);
      if (scanResult.type !== 'success') {
        continue;
      }
      allFilePaths.push(...scanResult.value.paths);
      if (scanResult.value.isLimited) {
        isLimited = true;
      }
    }

    return { filePaths: Array.from(new Set(allFilePaths)), isLimited };
  }

  /**
   * パスリストに基づきメタデータを並列読み込みし、TrackRecord の配列を生成します。
   */
  private async loadTracksFromFiles(filePaths: string[]): Promise<TrackRecord[]> {
    const loadPromises = filePaths.map((path) => this.loadSingleTrack(path));
    const results = await Promise.all(loadPromises);

    const tracks: TrackRecord[] = [];
    for (const result of results) {
      if (result.type === 'success') {
        tracks.push(result.value);
      }
    }
    return tracks;
  }

  /**
   * 1つのファイルに対してメタデータの読込と TrackRecord への変換を行います。
   */
  private async loadSingleTrack(path: string): Promise<TagResult<TrackRecord>> {
    const result = await window.api.readMetadata(path);

    if (result.type === 'error') {
      return result;
    }

    return success({
      path,
      metadata: result.value,
      imageUrl: createImageUrl(result.value.picture),
      isModified: false
    });
  }

  /**
   * 指定されたトラックのメタデータをディスクから再読み込みし、オブジェクトを更新します。
   */
  async reloadTrack(track: TrackRecord): Promise<TagResult<void>> {
    const result = await window.api.readMetadata(track.path);

    if (result.type === 'error') {
      return result;
    }

    // オブジェクトの中身を更新（参照は維持）
    track.metadata = result.value;
    track.imageUrl = createImageUrl(result.value.picture);
    track.isModified = false;

    return success(undefined);
  }

  /**
   * 指定されたトラック群のメタデータをディスクに保存します。
   */
  async saveTracks(tracks: TrackRecord[]): Promise<TagResult<void>> {
    for (const track of tracks) {
      const result = await window.api.writeMetadata(track.path, $state.snapshot(track.metadata));
      if (result.type === 'error') {
        return result;
      }
    }
    return success(undefined);
  }

  /**
   * 画像ファイルを選択し、メタデータ用の Picture オブジェクトを返します。
   */
  async pickImage(): Promise<TagResult<Picture | null>> {
    return await window.api.pickImage();
  }
}

export const tagIoService = new TagIoService();
