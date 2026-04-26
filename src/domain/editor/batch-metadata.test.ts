import { describe, it, expect } from 'vitest';
import { deriveCommonMetadata } from './batch-metadata';
import type { FlacMetadata } from '@domain/flac/models';

describe('deriveCommonMetadata', () => {
  const mockMetadata1: FlacMetadata = {
    title: 'Song 1',
    album: 'Album A',
    artist: ['Artist 1'],
    albumArtist: ['Artist 1'],
    genre: ['Genre 1'],
    trackNumber: '1',
    trackTotal: '10',
    discNumber: '1',
    discTotal: '1',
    date: '2024',
    catalogNumber: 'CAT-001',
    picture: {
      format: 'image/jpeg',
      sourcePath: 'path1.flac',
      hash: 'hash1'
    },
    streamInfo: {
      sampleRate: 44100,
      channels: 2,
      bitDepth: 16,
      duration: 300
    }
  };

  const mockMetadata2: FlacMetadata = {
    ...mockMetadata1,
    title: 'Song 2',
    trackNumber: '2'
  };

  it('リストが空の場合、nullを返すこと', () => {
    expect(deriveCommonMetadata([])).toBe(null);
  });

  it('全てのメタデータが同一の場合、uniform な値を返すこと', () => {
    const result = deriveCommonMetadata([mockMetadata1, mockMetadata1]);
    expect(result).not.toBeNull();
    if (result) {
      expect(result.album).toEqual({ type: 'uniform', value: 'Album A' });
      expect(result.artist).toEqual({ type: 'uniform', value: ['Artist 1'] });
      expect(result.picture).toEqual({ type: 'uniform', value: mockMetadata1.picture });
      expect(result.sampleRate).toEqual({ type: 'uniform', value: 44100 });
    }
  });

  it('異なる値が含まれる場合、divergent とユニオンリストを返すこと', () => {
    const result = deriveCommonMetadata([mockMetadata1, mockMetadata2]);
    expect(result).not.toBeNull();
    if (result) {
      // 異なるタイトル（単一値フィールドは現在 values 未対応だが divergent であることは確認）
      expect(result.title).toEqual({ type: 'divergent' });
      expect(result.trackNumber).toEqual({ type: 'divergent' });
      // 同一のアルバム名
      expect(result.album).toEqual({ type: 'uniform', value: 'Album A' });
      // 同一のアーティスト
      expect(result.artist).toEqual({ type: 'uniform', value: ['Artist 1'] });
    }
  });

  it('複数値フィールドが不一致の場合、ソートされたユニオンリストを返すこと', () => {
    const meta1: FlacMetadata = { ...mockMetadata1, artist: ['Artist B', 'Artist A'] };
    const meta2: FlacMetadata = { ...mockMetadata1, artist: ['Artist C', 'Artist A'] };
    const result = deriveCommonMetadata([meta1, meta2]);

    expect(result?.artist).toEqual({
      type: 'divergent',
      values: ['Artist A', 'Artist B', 'Artist C']
    });
  });

  it('複数値フィールドに空の配列や未定義が含まれる場合も正しくユニオンを作成すること', () => {
    const meta1: FlacMetadata = { ...mockMetadata1, genre: ['Rock'] };
    const meta2: FlacMetadata = { ...mockMetadata1, genre: [] };
    const result = deriveCommonMetadata([meta1, meta2]);

    expect(result?.genre).toEqual({
      type: 'divergent',
      values: ['Rock']
    });
  });

  it('画像ハッシュが異なる場合、画像項目は divergent になること', () => {
    const mockMetadataWithDifferentPic: FlacMetadata = {
      ...mockMetadata1,
      picture: {
        ...mockMetadata1.picture!,
        hash: 'hash2'
      }
    };
    const result = deriveCommonMetadata([mockMetadata1, mockMetadataWithDifferentPic]);
    expect(result?.picture).toEqual({ type: 'divergent' });
  });

  it('両方の画像が未設定の場合、uniform (undefined) になること', () => {
    const mockNoPic1: FlacMetadata = { ...mockMetadata1, picture: undefined };
    const mockNoPic2: FlacMetadata = { ...mockMetadata1, picture: undefined };
    const result = deriveCommonMetadata([mockNoPic1, mockNoPic2]);
    expect(result?.picture).toEqual({ type: 'uniform', value: undefined });
  });

  it('画像の有無が混在する場合、divergent になること', () => {
    const mockNoPic: FlacMetadata = { ...mockMetadata1, picture: undefined };
    const result = deriveCommonMetadata([mockMetadata1, mockNoPic]);
    expect(result?.picture).toEqual({ type: 'divergent' });
  });
});
