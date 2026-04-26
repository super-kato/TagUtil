import { sanitize } from '@shared/utils/filename';
import { failure, success } from '@domain/common/result';
import { tagErrors, type FlacTrack, type TagResult } from './types';

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

  // 必須フィールドのチェック（パターンに含まれている場合のみ）
  if (pattern.includes('{trackNumber}') && !metadata.trackNumber) {
    return failure(tagErrors.missingTrackNumber({ path: track.path }));
  }
  if (pattern.includes('{title}') && !metadata.title) {
    return failure(tagErrors.missingTitle({ path: track.path }));
  }

  // 置換処理
  const replacements: Record<string, string | number | undefined> = {
    ['{trackNumber}']: metadata.trackNumber
      ? metadata.trackNumber.toString().padStart(trackNumberPadding, '0')
      : '',
    ['{title}']: metadata.title,
    ['{album}']: metadata.album,
    ['{artist}']: metadata.artist?.join(', '),
    ['{year}']: metadata.date,
    ['{genre}']: metadata.genre?.join(', ')
  };

  Object.entries(replacements).forEach(([placeholder, value]) => {
    filename = filename.replaceAll(placeholder, value?.toString() ?? '');
  });

  // 拡張子を付与
  if (!filename.toLowerCase().endsWith('.flac')) {
    filename += '.flac';
  }

  return success(sanitize(filename));
};
