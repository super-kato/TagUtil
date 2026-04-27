import { MESSAGES } from '@domain/common/messages';
import type { EditableMultiKey, EditableSingleKey } from '@domain/editor/batch-metadata';
import type { FlacTrack } from '@domain/flac/models';
import type { AppResult } from '@domain/flac/types';
import { tagRepository } from '@renderer/infrastructure/repositories/tag-repository';
import { logStore } from '@renderer/stores/log-store.svelte';
import { TrackRecord } from '@renderer/stores/track-record.svelte';
import { trackStore } from '@renderer/stores/track-store.svelte';
import { uiState } from '@renderer/stores/ui-state.svelte';
import { pooledAll } from '@renderer/utils/concurrency';
import { tagEditor } from './tag-editor';

/**
 * スキャン処理の共通的なフローを制御するヘルパー関数。
 */
const handleScanOperation = async (
  operation: () => Promise<AppResult<{ tracks: FlacTrack[]; isLimited: boolean } | null>>
): Promise<void> => {
  uiState.startLoading();

  try {
    const result = await operation();

    if (result.type === 'error') {
      return;
    }
    if (!result.value) {
      return;
    }

    const { tracks: rawTracks, isLimited } = result.value;
    trackStore.tracks = rawTracks.map((t) => new TrackRecord(t.path, t.metadata));

    if (isLimited) {
      logStore.addWarn({ message: MESSAGES.SCAN_LIMIT_EXCEEDED, context: 'TagActions' });
    }
  } finally {
    uiState.stopLoading();
  }
};

/**
 * フォルダ選択ダイアログを開き、中のFLACファイルをスキャンします。
 */
const openAndScanDirectory = async (): Promise<void> => {
  await handleScanOperation(() => tagRepository.scanAndLoadTracks());
};

/**
 * 指定された複数のパスを直接スキャンして読み込みます。
 */
const loadFromPaths = async (targetPaths: string[]): Promise<void> => {
  await handleScanOperation(() => tagRepository.loadTracksFromPaths(targetPaths));
};

/**
 * 選択中のフィールドを更新します。
 */
const updateSelectedSingleField = (key: EditableSingleKey, value: string): void => {
  tagEditor.updateSingleField(trackStore.selectedTracks, key, value);
};

const updateSelectedMultiField = (key: EditableMultiKey, index: number, value: string): void => {
  tagEditor.updateMultiField(trackStore.selectedTracks, key, index, value);
};

const addSelectedMultiFieldValue = (key: EditableMultiKey, value: string = ''): void => {
  tagEditor.addMultiFieldValue(trackStore.selectedTracks, key, value);
};

const applySelectedMultiFieldChange = (
  key: EditableMultiKey,
  oldValue: string | undefined,
  newValue: string | undefined
): void => {
  if (oldValue !== undefined) {
    tagEditor.removeMultiFieldValue(trackStore.selectedTracks, key, oldValue);
  }
  if (newValue !== undefined && newValue !== '') {
    tagEditor.addMultiFieldValue(trackStore.selectedTracks, key, newValue);
  }
};

const removeSelectedMultiFieldValue = (key: EditableMultiKey, value: string): void => {
  tagEditor.removeMultiFieldValue(trackStore.selectedTracks, key, value);
};

/**
 * 画像ファイルを選択し、選択中のトラックに適用します。
 */
const pickAndApplyPicture = async (): Promise<void> => {
  const result = await tagRepository.pickImage();
  if (result.type === 'error') {
    return;
  }
  if (result.value) {
    tagEditor.applyPicture(trackStore.selectedTracks, result.value);
  }
};

/**
 * 指定されたパスの画像を読み込み、選択中のトラックに適用します（ドラッグ＆ドロップ用）。
 */
const applyPictureFromPath = async (path: string): Promise<void> => {
  const result = await tagRepository.getImageInfo(path);
  if (result.type === 'error') {
    return;
  }
  if (result.value) {
    tagEditor.applyPicture(trackStore.selectedTracks, result.value);
  }
};

/**
 * 選択中のトラックから画像を消去します。
 */
const removeArtwork = (): void => {
  tagEditor.removePicture(trackStore.selectedTracks);
};

/**
 * 自動採番を実行します。
 */
const applyAutoNumbering = (): void => {
  tagEditor.applyAutoNumbering(trackStore.selectedTracks);
};

/**
 * 選択中の変更を破棄して再読み込みします。
 */
const revertSelected = async (): Promise<void> => {
  const modifiedSelected = trackStore.selectedTracks.filter((t) => t.isModified);
  if (modifiedSelected.length === 0) {
    return;
  }

  uiState.startLoading();
  try {
    const tasks = modifiedSelected.map((track) => () => revert(track));
    await pooledAll(tasks);
  } finally {
    uiState.stopLoading();
  }
};

const revert = async (track: TrackRecord): Promise<void> => {
  const result = await tagRepository.readMetadata(track.path);
  if (result.type !== 'success') {
    return;
  }
  track.metadata = result.value.metadata;
  track.markAsSaved();
};

/**
 * 変更があったすべてのトラックを保存します。
 */
const saveAllModified = async (): Promise<void> => {
  const modified = trackStore.tracks.filter((t) => t.isModified);
  if (modified.length === 0) {
    return;
  }

  uiState.startLoading();

  try {
    // インフラ層に渡すためにドメインモデルの配列に整形
    const rawData = modified.map((t) => t.toFlacTrack());
    const successes = await tagRepository.saveTracks(rawData);

    const successPaths = new Set(successes);
    for (const track of modified) {
      if (!successPaths.has(track.path)) {
        continue;
      }
      track.markAsSaved();
    }
  } finally {
    uiState.stopLoading();
  }
};

/**
 * トラックのコンテキストメニューを表示します。
 */
const showTrackContextMenu = async (track: TrackRecord): Promise<void> => {
  await tagRepository.showTrackContextMenu(track.path);
};

/**
 * ユーザーの操作（ユースケース）に応じた一連のフローを制御するオブジェクト。
 * Storeの状態変更、Editorによるデータ加工、I/Oサービスとの通信をオーケストレーターとしてまとめます。
 */
export const tagActions = {
  openAndScanDirectory,
  loadFromPaths,
  updateSelectedSingleField,
  updateSelectedMultiField,
  addSelectedMultiFieldValue,
  removeSelectedMultiFieldValue,
  applySelectedMultiFieldChange,
  pickAndApplyPicture,
  applyPictureFromPath,
  removeArtwork,
  applyAutoNumbering,
  revertSelected,
  saveAllModified,
  showTrackContextMenu
} as const;
