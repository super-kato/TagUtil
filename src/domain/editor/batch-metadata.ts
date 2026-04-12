import type { FlacMetadata, Picture, StreamInfo } from '@domain/flac/types';
import { arraysEqual } from '@shared/utils/array';

export type FieldState<T> = { type: 'uniform'; value: T } | { type: 'divergent' };

/**
 * 単一値（文字列）として管理されるキーの一覧
 */
const EDITABLE_SINGLE_KEYS = [
  'title',
  'album',
  'trackNumber',
  'trackTotal',
  'discNumber',
  'discTotal',
  'date',
  'catalogNumber'
] as const;

/**
 * 複数値（配列）として管理されるキーの一覧
 */
const EDITABLE_MULTI_KEYS = ['artist', 'albumArtist', 'genre'] as const;

/** 編集可能な単一値フィールドのキー */
export type EditableSingleKey = (typeof EDITABLE_SINGLE_KEYS)[number];
/** 編集可能な複数値フィールドのキー */
export type EditableMultiKey = (typeof EDITABLE_MULTI_KEYS)[number];
/** 全ての編集可能なタグキー */
export type EditableStringKey = EditableSingleKey | EditableMultiKey;

/** 単一値タグ情報のバッチ状態サマリー */
type SingleFieldSummary = { -readonly [K in EditableSingleKey]: FieldState<string | undefined> };

/** 複数値タグ情報のバッチ状態サマリー */
type MultiFieldSummary = { -readonly [K in EditableMultiKey]: FieldState<string[] | undefined> };

/** 全てのタグ情報のバッチ状態サマリー */
type EditableFieldSummary = SingleFieldSummary & MultiFieldSummary;

/** アートワーク情報のバッチ状態サマリー */
type PictureSummary = { picture: FieldState<Picture | null | undefined> };

/** 技術情報（STREAMINFO）のバッチ状態サマリー */
type StreamInfoSummary = { -readonly [K in keyof StreamInfo]: FieldState<StreamInfo[K]> };

/**
 * 各メタデータ項目のバッチ状態をまとめたサマリー。
 */
export type BatchMetadataSummary = EditableFieldSummary & PictureSummary & StreamInfoSummary;

/**
 * 複数のメタデータから、各フィールドの共通性（Uniform/Divergent）を導出します。
 */
export const deriveCommonMetadata = (
  metadataList: FlacMetadata[]
): Readonly<BatchMetadataSummary> | null => {
  if (!metadataList.length) {
    return null;
  }
  // 各カテゴリのサマリーを個別に算出し、マージする
  return {
    ...deriveSingleValueTags(metadataList),
    ...deriveMultiValueTags(metadataList),
    ...deriveCommonPicture(metadataList),
    ...deriveCommonStreamInfo(metadataList)
  } as const;
};

/**
 * 単一値フィールドの共通性を算出します。
 */
const deriveSingleValueTags = (metadataList: FlacMetadata[]): SingleFieldSummary => {
  const first = metadataList[0];
  const result = {} as SingleFieldSummary;

  for (const key of EDITABLE_SINGLE_KEYS) {
    const firstValue = first[key];
    const allSame = metadataList.every((meta) => meta[key] === firstValue);

    result[key] = (
      allSame ? { type: 'uniform', value: firstValue } : { type: 'divergent' }
    ) as FieldState<string | undefined>;
  }

  return result;
};

/**
 * 複数値フィールドの共通性を算出します。
 */
const deriveMultiValueTags = (metadataList: FlacMetadata[]): MultiFieldSummary => {
  const first = metadataList[0];
  const result = {} as MultiFieldSummary;

  for (const key of EDITABLE_MULTI_KEYS) {
    const firstValue = first[key];
    const allSame = metadataList.every((meta) => arraysEqual(meta[key], firstValue));

    result[key] = (
      allSame ? { type: 'uniform', value: firstValue } : { type: 'divergent' }
    ) as FieldState<string[] | undefined>;
  }

  return result;
};

/**
 * アートワークの共通性をハッシュ値に基づいて算出します。
 */
const deriveCommonPicture = (metadataList: FlacMetadata[]): PictureSummary => {
  const first = metadataList[0];

  // 全てのメタデータの画像のハッシュ値を比較する
  const allSame = metadataList.every((meta) => {
    if (!first.picture && !meta.picture) {
      return true;
    }
    if (!first.picture || !meta.picture) {
      return false;
    }
    return first.picture.hash === meta.picture.hash;
  });

  return {
    picture: allSame ? { type: 'uniform', value: first.picture } : { type: 'divergent' }
  };
};

/**
 * 技術情報（STREAMINFO）の共通性を算出します。
 */
const deriveCommonStreamInfo = (metadataList: FlacMetadata[]): Partial<StreamInfoSummary> => {
  const first = metadataList[0];
  if (!first.streamInfo) {
    return {};
  }

  const result = {} as StreamInfoSummary;

  for (const key in first.streamInfo) {
    const k = key as keyof StreamInfo;
    const allSame = metadataList.every((meta) => meta.streamInfo?.[k] === first.streamInfo?.[k]);

    result[k] = allSame ? { type: 'uniform', value: first.streamInfo[k] } : { type: 'divergent' };
  }

  return result;
};
