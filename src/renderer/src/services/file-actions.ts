import { formatFlacFilename } from '@domain/flac/filename-formatter';
import { TrackRecord } from '@renderer/stores/track-record.svelte';
import { trackStore } from '@renderer/stores/track-store.svelte';
import { uiState } from '@renderer/stores/ui-state.svelte';
import { selectionState } from '@renderer/stores/selection-state.svelte';
import { tagRepository } from '@renderer/infrastructure/repositories/tag-repository';
import { fileRepository } from '@renderer/infrastructure/repositories/file-repository';
import { getDirectoryName, joinPath } from '@renderer/infrastructure/adapters/path-adapter';
import { logStore } from '@renderer/stores/log-store.svelte';
import { formatTagError } from '@domain/flac/tag-error-formatter';
import { failure, success, type Result } from '@domain/common/result';
import type { TagError } from '@domain/flac/types';

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
 * 選択された全てのトラックに対してリネームを試行し、結果をマップに集約します。
 * エラーが発生した場合は途中で処理を中断します。
 */
const executeRenameLoop = async (selected: TrackRecord[]): Promise<Map<string, TrackRecord>> => {
  const renamedMap = new Map<string, TrackRecord>();

  for (const track of selected) {
    const result = await renameTrack(track);

    if (result.type === 'error') {
      break;
    }

    if (result.value) {
      renamedMap.set(track.path, result.value);
    }
  }

  return renamedMap;
};

/**
 * 単一のトラックに対して、ファイル名生成、パス計算、リネーム実行、再読み込みの一連の処理を行います。
 * 成功した場合は新しい TrackRecord を返し、スキップ（変更不要など）時は null を返します。
 */
const renameTrack = async (track: TrackRecord): Promise<Result<TrackRecord | null, TagError>> => {
  // 1. フォーマット処理（メタデータが足りない場合は Result 型のエラーが返る）
  const filenameResult = formatFlacFilename(track.toFlacTrack());
  if (filenameResult.type === 'error') {
    // レンダラー側のエラーなので明示的にログ追加
    logStore.addError(formatTagError(filenameResult.error));
    return failure(filenameResult.error);
  }

  // 2. 新しいパスの取得と重複チェック（既存のフォルダ構造を維持して置換）
  const dir = await getDirectoryName(track.path);
  const newPath = await joinPath(dir, filenameResult.value);
  if (track.path === newPath) {
    return success(null);
  }

  // 3. 物理的なリネーム実行
  const result = await fileRepository.renameFile(track.path, newPath);
  if (result.type === 'error') {
    // メインプロセス側で既にログ出力されているため、ここでは Result を返すのみ
    return failure(result.error);
  }

  // 3. 成功時: 再読み込みして新しい不変インスタンスを作成
  const reloadResult = await tagRepository.readMetadata(newPath);
  if (reloadResult.type === 'error') {
    return failure(reloadResult.error);
  }

  return success(new TrackRecord(newPath, reloadResult.value.metadata));
};

/**
 * ファイル操作に関連するユースケースのフローを制御するオブジェクト。
 */
export const fileActions = {
  renameSelectedFiles
} as const;
