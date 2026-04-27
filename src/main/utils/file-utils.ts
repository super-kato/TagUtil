import { SUPPORTED_AUDIO_EXTENSIONS } from '@domain/file-extensions';
import { basename, extname } from 'node:path';

/**
 * 指定されたパスが隠しファイル（ドットで始まる）かどうかを判定します。
 */
export const isHiddenPath = (path: string): boolean => {
  return basename(path).startsWith('.');
};

/**
 * 指定されたパスがサポートされている形式（現在は FLAC）かどうかを判定します。
 */
export const isSupportedAudioFile = (path: string): boolean => {
  return SUPPORTED_AUDIO_EXTENSIONS.includes(extname(path).toLowerCase());
};
