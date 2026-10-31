import type { AudioFormat } from '@domain/audio/models';
import type { FlacMetadata, Picture } from '@domain/flac/models';

import type { ElementType } from '@shared/types';
import { isDeepEqual } from '@shared/utils/equality';

export type FieldState<T> =
  | { type: 'uniform'; value: T }
  | { type: 'divergent'; values?: ElementType<T>[] };

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

/** 技術情報（AudioFormatInfo）のバッチ状態サマリー */
type AudioFormatSummary = {
  -readonly [K in keyof AudioFormat]: FieldState<AudioFormat[K]>;
};

/**
 * 各メタデータ項目のバッチ状態をまとめたサマリー。
 */
export type BatchMetadataSummary = EditableFieldSummary & PictureSummary & AudioFormatSummary;

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
    ...deriveCommonFormatInfo(metadataList)
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
 * 複数値フィールドの共通性を算出し、バラバラな場合はユニオン（和）を作成します。
 */
const deriveMultiValueTags = (metadataList: FlacMetadata[]): MultiFieldSummary => {
  const result = {} as MultiFieldSummary;

  for (const key of EDITABLE_MULTI_KEYS) {
    const firstValue = metadataList[0][key];
    const allSame = metadataList.every((meta) => isDeepEqual(meta[key], firstValue));

    if (allSame) {
      result[key] = { type: 'uniform', value: firstValue };
      continue;
    }

    const unionValues = new Set(metadataList.flatMap((meta) => meta[key] || []).filter((v) => !!v));
    // ユニオンリストを作成し、文字の昇順でソート
    const values = Array.from(unionValues).sort((a, b) => a.localeCompare(b));

    result[key] = { type: 'divergent', values };
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
 * 技術情報（AudioFormatInfo）の共通性を算出します。
 */
const deriveCommonFormatInfo = (metadataList: FlacMetadata[]): Partial<AudioFormatSummary> => {
  const first = metadataList[0];
  if (!first.format) {
    return {};
  }

  const result = {} as AudioFormatSummary;

  for (const key in first.format) {
    const k = key as keyof AudioFormat;
    const allSame = metadataList.every((meta) => meta.format?.[k] === first.format?.[k]);

    result[k] = allSame ? { type: 'uniform', value: first.format[k] } : { type: 'divergent' };
  }

  return result;
};
