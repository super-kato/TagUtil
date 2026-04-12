import type { FlacMetadata } from '@domain/flac/types';

/**
 * 1つのFLACファイルとその状態を管理するインターフェース。
 */
export interface TrackRecord {
  path: string;
  metadata: FlacMetadata;
  imageUrl: string | null;
  isModified: boolean;
}
