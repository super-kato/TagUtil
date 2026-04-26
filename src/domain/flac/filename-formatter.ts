import { failure, success } from '@domain/common/result';
import { ValuesOf } from '@shared/types';
import { sanitize } from '@shared/utils/filename';
import { TAG_PLACEHOLDERS } from './constants';
import { tagErrors } from './errors';
import type { TagResult } from './types';
import type { FlacMetadata, FlacTrack } from './models';

type ResolverOptions = { trackNumberPadding: number };

/**
 * リネーム生成のオプション。
 */
export interface FormatOptions {
  /** リネームパターン（例: "{trackNumber} - {title}"） */
  pattern: string;
  /** トラック番号のパディング桁数 */
  trackNumberPadding: number;
}

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
 * @param options 生成オプション
 */
export const formatFlacFilename = (track: FlacTrack, options: FormatOptions): TagResult<string> => {
  const placeholders = Object.values(TAG_PLACEHOLDERS) as ValuesOf<typeof TAG_PLACEHOLDERS>[];

  // パターンに少なくとも1つのプレースホルダが含まれているかチェック
  const hasPlaceholder = placeholders.some((placeholder) => options.pattern.includes(placeholder));
  if (!hasPlaceholder) {
    return failure(tagErrors.invalidRenamePattern({ path: track.path }));
  }

  // 置換処理とバリデーション
  let filename = options.pattern;
  for (const placeholder of placeholders) {
    if (!filename.includes(placeholder)) {
      continue;
    }

    const resolver = PLACEHOLDER_RESOLVERS[placeholder];
    const value = resolver(track.metadata, { trackNumberPadding: options.trackNumberPadding });

    // 値が空（または未定義）の場合はエラー
    if (!value || value.toString().trim() === '') {
      return failure(tagErrors.missingRequiredTag({ path: track.path, detail: placeholder }));
    }

    filename = filename.replaceAll(placeholder, value.toString());
  }

  return success(sanitize(filename));
};
