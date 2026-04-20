import { formatFlacFilename } from '@domain/flac/filename-formatter';
import { TrackRecord } from '../stores/track-record.svelte';
import { trackStore } from '../stores/track-store.svelte';
import { uiState } from '../stores/ui-state.svelte';
import { selectionState } from '../stores/selection-state.svelte';
import { tagRepository } from '../infrastructure/tag-repository';
import { fileRepository } from '../infrastructure/file-repository';
import { getDirectoryName, joinPath } from '../infrastructure/path-adapter';

/**
 * 選択中のファイルをメタデータに基づいてリネームします。
 */
const renameSelectedFiles = async (): Promise<void> => {
  const selected = trackStore.selectedTracks;
  if (selected.length === 0) {
    return;
  }

  uiState.startLoading();
  uiState.clearError();

  try {
    const renamedMap = await executeRenameLoop(selected);

    // 成功したファイルがあればストアを差し替え
    if (renamedMap.size > 0) {
      trackStore.tracks = trackStore.tracks.map((t) => renamedMap.get(t.path) ?? t);
      selectionState.paths.clear();
    }
  } finally {
    uiState.stopLoading();
  }
};

/**
 * 選択された全てのトラックに対してリネームを試行し、結果をマップに集約します。
 * エラーが発生した場合は途中で処理を中断します。
 */
const executeRenameLoop = async (selected: TrackRecord[]): Promise<Map<string, TrackRecord>> => {
  const renamedMap = new Map<string, TrackRecord>();

  for (const track of selected) {
    const updatedRecord = await renameTrack(track);

    if (updatedRecord) {
      renamedMap.set(track.path, updatedRecord);
    }

    // 各トラックの処理中にエラーが発生した場合はループを即時中断
    if (uiState.error) {
      break;
    }
  }

  return renamedMap;
};

/**
 * 単一のトラックに対して、ファイル名生成、パス計算、リネーム実行、再読み込みの一連の処理を行います。
 * 成功した場合は新しい TrackRecord を返し、スキップ（変更不要など）やエラー時は null を返します。
 */
const renameTrack = async (track: TrackRecord): Promise<TrackRecord | null> => {
  // 1. フォーマット処理（メタデータが足りない場合は Result 型のエラーが返る）
  const filenameResult = formatFlacFilename(track.toFlacTrack());
  if (filenameResult.type === 'error') {
    uiState.setError(filenameResult);
    return null;
  }

  // 2. 新しいパスの取得と重複チェック（既存のフォルダ構造を維持して置換）
  const dir = getDirectoryName(track.path);
  const newPath = joinPath(dir, filenameResult.value);
  if (track.path === newPath) {
    return null;
  }

  // 3. 物理的なリネーム実行
  const result = await fileRepository.renameFile(track.path, newPath);
  if (result.type === 'error') {
    uiState.setError(result);
    return null;
  }

  // 3. 成功時: 再読み込みして新しい不変インスタンスを作成
  const reloadResult = await tagRepository.readMetadata(newPath);
  if (reloadResult.type === 'error') {
    uiState.setError(reloadResult);
    return null;
  }

  return new TrackRecord(newPath, reloadResult.value.metadata);
};

/**
 * ファイル操作に関連するユースケースのフローを制御するオブジェクト。
 */
export const fileActions = {
  renameSelectedFiles
} as const;
