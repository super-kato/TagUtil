import { AudioMetadata, AudioTrack, Picture } from '@domain/audio/models';

export type { Picture };

/**
 * FLACファイルのメタデータを表すドメインモデル。
 */
export interface FlacMetadata extends AudioMetadata {}

/**
 * FLACファイルとそのメタデータのペアを表すドメインモデル。
 */
export interface FlacTrack extends AudioTrack<FlacMetadata> {}
