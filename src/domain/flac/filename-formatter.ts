import { sanitize } from '../../shared/utils/filename';
import { failure, success } from '../common/result';
import { tagErrors, type FlacTrack, type TagResult } from './types';

const TRACK_NUMBER_PADDING = 2;

/**
 * メタデータに基づいてFLACのファイル名を生成します。
 * 形式: "{trackNumber} - {title}.flac"
 * トラック番号またはタイトルが欠損している場合は TagResult の Failure を返します。
 */
export const formatFlacFilename = (track: FlacTrack): TagResult<string> => {
  const { trackNumber, title } = track.metadata;

  if (!trackNumber) {
    return failure(tagErrors.missingTrackNumber({ path: track.path }));
  }

  if (!title) {
    return failure(tagErrors.missingTitle({ path: track.path }));
  }

  const paddedNumber = trackNumber.toString().padStart(TRACK_NUMBER_PADDING, '0');
  const filename = `${paddedNumber} - ${title}.flac`;

  return success(sanitize(filename));
};
