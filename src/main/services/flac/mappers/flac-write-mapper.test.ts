import { FlacMetadata } from '@domain/flac/models';
import { RawFlacData, RawPicture } from '@main/infrastructure/repositories/repository-types';
import { describe, expect, it } from 'vitest';
import { mergeMetadataWithTags } from './flac-write-mapper';

describe('flac-write-mapper', () => {
  const dummyRawData: RawFlacData = {
    path: '/path/to/audio.flac',
    tags: {
      TITLE: ['Old Title'],
      ARTIST: ['Old Artist'],
      GENRE: ['Rock']
    },
    pictures: [],
    streamInfo: {
      sampleRate: 44100,
      bitDepth: 16,
      channels: 2,
      duration: 100
    }
  };

  it('メタデータが既存のタグに正しくマージされること', () => {
    const metadata: FlacMetadata = {
      title: 'New Title',
      artist: ['New Artist'],
      trackNumber: '1'
    };

    const result = mergeMetadataWithTags(dummyRawData, metadata);

    expect(result.tags.TITLE).toEqual(['New Title']);
    expect(result.tags.ARTIST).toEqual(['New Artist']);
    expect(result.tags.TRACKNUMBER).toEqual(['1']);
    expect(result.tags.GENRE).toEqual(['Rock']); // 既存のタグが維持されること
  });

  it('複数値を持つプロパティが正しくマージされること', () => {
    const metadata: FlacMetadata = {
      title: 'Title',
      artist: ['Artist 1', 'Artist 2']
    };

    const result = mergeMetadataWithTags(dummyRawData, metadata);

    expect(result.tags.ARTIST).toEqual(['Artist 1', 'Artist 2']);
  });

  it('空文字のメタデータはタグから削除されること', () => {
    const metadata: FlacMetadata = {
      title: '',
      artist: []
    };

    const result = mergeMetadataWithTags(dummyRawData, metadata);

    expect(result.tags.TITLE).toBeUndefined();
    expect(result.tags.ARTIST).toBeUndefined();
  });

  it('シノニム（小文字タグ等）が正規化されて削除されること', () => {
    const rawDataWithSynonyms: RawFlacData = {
      ...dummyRawData,
      tags: {
        title: ['lower title'],
        ARTIST: ['Old Artist']
      }
    };
    const metadata: FlacMetadata = {
      title: 'New Title'
    };

    const result = mergeMetadataWithTags(rawDataWithSynonyms, metadata);

    expect(result.tags.TITLE).toEqual(['New Title']);
    expect(result.tags.title).toBeUndefined();
  });

  it('画像データが正しくセットされること', () => {
    const metadata: FlacMetadata = {
      title: 'Title'
    };
    const picture: RawPicture = {
      mime: 'image/png',
      buffer: Buffer.from('dummy'),
      hash: 'hash'
    };

    const result = mergeMetadataWithTags(dummyRawData, metadata, picture);

    expect(result.pictures).toHaveLength(1);
    expect(result.pictures[0].mime).toBe('image/png');
  });
});
