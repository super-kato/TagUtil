import { failure, success } from '@domain/common/result';
import { ValuesOf } from '@shared/types';
import { sanitize } from '@shared/utils/filename';
import {
  TAG_PLACEHOLDERS,
  tagErrors,
  type FlacMetadata,
  type FlacTrack,
  type TagResult
} from './types';

type ResolverOptions = { trackNumberPadding: number };

/**
 * 各プレースホルダのリゾルバ関数の定義。
 */
const PLACEHOLDER_RESOLVERS: Record<
  ValuesOf<typeof TAG_PLACEHOLDERS>,
  (metadata: FlacMetadata, options: ResolverOptions) => string | undefined
> = {
  [TAG_PLACEHOLDERS.TRACK_NUMBER]: (metadata, { trackNumberPadding }) =>
    metadata.trackNumber?.toString().padStart(trackNumberPadding, '0'),
  [TAG_PLACEHOLDERS.TITLE]: (metadata) => metadata.title,
  [TAG_PLACEHOLDERS.ALBUM]: (metadata) => metadata.album,
  [TAG_PLACEHOLDERS.ARTIST]: (metadata) => metadata.artist?.join(', '),
  [TAG_PLACEHOLDERS.YEAR]: (metadata) => metadata.date,
  [TAG_PLACEHOLDERS.GENRE]: (metadata) => metadata.genre?.join(', ')
} as const;

/**
 * メタデータに基づいてFLACのファイル名を生成します。
 * @param track トラック情報
 * @param pattern リネームパターン（例: "{trackNumber} - {title}"）
 * @param trackNumberPadding トラック番号のパディング桁数
 */
export const formatFlacFilename = (
  track: FlacTrack,
  pattern: string,
  trackNumberPadding: number
): TagResult<string> => {
  const { metadata } = track;
  let filename = pattern;

  // パターンに少なくとも1つのプレースホルダが含まれているかチェック
  const hasPlaceholder = Object.keys(PLACEHOLDER_RESOLVERS).some((placeholder) =>
    pattern.includes(placeholder)
  );

  if (!hasPlaceholder) {
    return failure(tagErrors.invalidRenamePattern({ path: track.path }));
  }

  // 置換処理とバリデーション
  // パターンに含まれるすべてのプレースホルダについて、値が存在するかチェックする
  for (const [placeholder, resolver] of Object.entries(PLACEHOLDER_RESOLVERS)) {
    if (!pattern.includes(placeholder)) {
      continue;
    }

    const value = resolver(metadata, { trackNumberPadding });

    // 値が空（または未定義）の場合はエラー
    if (!value || value.toString().trim() === '') {
      return failure(tagErrors.missingRequiredTag({ path: track.path, detail: placeholder }));
    }

    filename = filename.replaceAll(placeholder, value.toString());
  }

  return success(sanitize(filename));
};
