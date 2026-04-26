import type { EditableMultiKey, EditableSingleKey } from '@domain/editor/batch-metadata';
import type { Picture } from '@domain/flac/models';
import { TrackRecord } from '@renderer/stores/track-record.svelte';

/**
 * 単一値フィールドを一括更新します。
 */
const updateSingleField = (tracks: TrackRecord[], key: EditableSingleKey, value: string): void => {
  for (const track of tracks) {
    track.metadata[key] = value;
  }
};

/**
 * 複数値フィールドの特定インデックスを更新します。
 */
const updateMultiField = (
  tracks: TrackRecord[],
  key: EditableMultiKey,
  index: number,
  value: string
): void => {
  for (const track of tracks) {
    const current = track.metadata[key];
    if (current) {
      current[index] = value;
    }
  }
};

/**
 * 複数値フィールドに新しい値を追加します。
 */
const addMultiFieldValue = (
  tracks: TrackRecord[],
  key: EditableMultiKey,
  value: string = ''
): void => {
  for (const track of tracks) {
    const current = track.metadata[key] || [];
    if (value !== '' && current.includes(value)) {
      continue;
    }
    track.metadata[key] = [...current, value];
  }
};

/**
 * 複数値フィールドから特定の値を削除します（該当するすべての値を削除）。
 */
const removeMultiFieldValue = (
  tracks: TrackRecord[],
  key: EditableMultiKey,
  value: string
): void => {
  for (const track of tracks) {
    const current = track.metadata[key];
    if (current) {
      track.metadata[key] = current.filter((v) => v !== value);
    }
  }
};

/**
 * 楽曲にカバーアートを適用します。
 */
const applyPicture = (tracks: TrackRecord[], picture: Picture): void => {
  for (const track of tracks) {
    track.metadata.picture = picture;
  }
};

/**
 * カバーアートを削除します。
 */
const removePicture = (tracks: TrackRecord[]): void => {
  for (const track of tracks) {
    track.metadata.picture = null;
  }
};

/**
 * トラック番号の自動採番（1, 2, 3...）を適用します。
 * 同時に総トラック数も選択数に合わせて更新します。
 */
const applyAutoNumbering = (tracks: TrackRecord[]): void => {
  const total = tracks.length;
  tracks.forEach((track, index) => {
    const num = index + 1;
    track.metadata.trackNumber = num.toString();
    track.metadata.trackTotal = total.toString();
  });
};

/**
 * トラックデータ（TrackRecord）に対する編集ロジック（ビジネスルール）を提供する。
 * 外部通信やUI状態の管理（loading, error等）には関知しません。
 */
export const tagEditor = {
  updateSingleField,
  updateMultiField,
  addMultiFieldValue,
  removeMultiFieldValue,
  applyPicture,
  removePicture,
  applyAutoNumbering
} as const;
