import { AudioMetadata, AudioTrack, Picture } from '@domain/audio/models';

/**
 * FLACファイルの技術情報（STREAMINFO）。
 * 全てのプロパティは読み取り専用であり、編集されることはありません。
 */
export interface StreamInfo {
  /** サンプリングレート (Hz) */
  readonly sampleRate?: number;
  /** ビット深度 (bit) */
  readonly bitDepth?: number;
  /** チャンネル数 */
  readonly channels?: number;
  /** 再生時間 (秒) */
  readonly duration?: number;
}

export type { Picture };

/**
 * FLACファイルのメタデータを表すドメインモデル。
 */
export interface FlacMetadata extends AudioMetadata {
  /** 技術情報 (STREAMINFO) - 読み取り専用 */
  readonly streamInfo?: StreamInfo;
}

/**
 * FLACファイルとそのメタデータのペアを表すドメインモデル。
 */
export interface FlacTrack extends AudioTrack<FlacMetadata> {}
