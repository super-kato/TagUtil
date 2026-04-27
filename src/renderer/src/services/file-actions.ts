import { success, type Result } from '@domain/common/result';
import type { AppError } from '@domain/errors/definitions';

import { generateNewPath } from '@renderer/infrastructure/adapters/path-adapter';
import { fileRepository } from '@renderer/infrastructure/repositories/file-repository';
import { tagRepository } from '@renderer/infrastructure/repositories/tag-repository';
import { selectionState } from '@renderer/stores/selection-state.svelte';
import { TrackRecord } from '@renderer/stores/track-record.svelte';
import { trackStore } from '@renderer/stores/track-store.svelte';
import { uiState } from '@renderer/stores/ui-state.svelte';
import { pooledAll } from '@renderer/utils/concurrency';

/**
 * 選択中のファイルをメタデータに基づいてリネームします。
 */
const renameSelectedFiles = async (): Promise<void> => {
  const selected = trackStore.selectedTracks;
  if (selected.length === 0) {
    return;
  }

  uiState.startLoading();

  try {
    const renamedMap = await executeRenameLoop(selected);

    // 成功したファイルがあればストアを差し替え
    if (renamedMap.size > 0) {
      trackStore.tracks = trackStore.tracks.map((t) => renamedMap.get(t.path) ?? t);
      selectionState.items.clear();
    }
  } finally {
    uiState.stopLoading();
  }
};

/**
 * 選択された全てのトラックに対してリネームを試行し、結果を集約します。
 * 1つ以上のエラーが発生しても、全てのトラックに対して処理を試行します。
 */
const executeRenameLoop = async (selected: TrackRecord[]): Promise<Map<string, TrackRecord>> => {
  const results = await pooledAll(selected.map((track) => () => renameTrack(track)));

  const renamedMap = new Map<string, TrackRecord>();
  for (const [index, result] of results.entries()) {
    if (result.type === 'error' || !result.value) {
      continue;
    }
    renamedMap.set(selected[index].path, result.value);
  }

  return renamedMap;
};

/**
 * 単一のトラックに対して、ファイル名生成、パス計算、リネーム実行、再読み込みの一連の処理を行います。
 * 成功した場合は新しい TrackRecord を返し、スキップ（変更不要など）時は null を返します。
 */
const renameTrack = async (track: TrackRecord): Promise<Result<TrackRecord | null, AppError>> => {
  // 1. メタデータに基づいた新しいパスの生成（フォーマットとパス結合を一括で行う）
  const pathResult = await generateNewPath(track.toFlacTrack());
  if (pathResult.type === 'error') {
    return pathResult;
  }

  const newPath = pathResult.value;
  if (track.path === newPath) {
    return success(null);
  }

  // 2. 物理的なリネーム実行
  const result = await fileRepository.renameFile(track.path, newPath);
  if (result.type === 'error') {
    return result;
  }

  // 3. 成功時: 再読み込みして新しい不変インスタンスを作成
  const reloadResult = await tagRepository.readMetadata(newPath);
  if (reloadResult.type === 'error') {
    return reloadResult;
  }

  return success(new TrackRecord(newPath, reloadResult.value.metadata));
};

/**
 * ファイル操作に関連するユースケースのフローを制御するオブジェクト。
 */
export const fileActions = {
  renameSelectedFiles
} as const;
