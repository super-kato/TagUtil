import { describe, it, expect } from 'vitest';
import { mergeMetadataWithTags } from './flac-write-mapper';
import { RawFlacData } from '@services/flac/types';
import { FlacMetadata } from '@domain/flac/models';

describe('flac-write-mapper', () => {
  describe('mergeMetadataWithTags', () => {
    it('メタデータが既存のタグに正しくマージされること', () => {
      const rawData: RawFlacData = {
        path: '/path/to/audio.flac',
        tags: {
          TITLE: ['Old Title'],
          CUSTOM: ['Custom Value']
        },
        pictures: [],
        streamInfo: {}
      };

      const metadata: FlacMetadata = {
        title: 'New Title',
        album: 'New Album'
      };

      const result = mergeMetadataWithTags(rawData, metadata);

      expect(result.tagMap['TITLE']).toBe('New Title');
      expect(result.tagMap['ALBUM']).toBe('New Album');
      // マッピングに含まれないタグは維持される（1要素なので文字列に変換されている）
      expect(result.tagMap['CUSTOM']).toBe('Custom Value');
    });

    it('複数値のプロパティが正しく書き込まれること', () => {
      const rawData: RawFlacData = {
        path: '/path/to/audio.flac',
        tags: {},
        pictures: [],
        streamInfo: {}
      };

      const metadata: FlacMetadata = {
        artist: ['Artist A', 'Artist B'],
        genre: ['Genre X']
      };

      const result = mergeMetadataWithTags(rawData, metadata);

      expect(result.tagMap['ARTIST']).toEqual(['Artist A', 'Artist B']);
      expect(result.tagMap['GENRE']).toEqual(['Genre X']);
    });

    it('別名（Synonyms）が正しく削除（クリーンアップ）されること', () => {
      const rawData: RawFlacData = {
        path: '/path/to/audio.flac',
        tags: {
          YEAR: ['2023'], // DATE の別名
          ENSEMBLE: ['Old Ensemble'] // ALBUMARTIST の別名
        },
        pictures: [],
        streamInfo: {}
      };

      const metadata: FlacMetadata = {
        date: '2024',
        albumArtist: ['New Artist']
      };

      const result = mergeMetadataWithTags(rawData, metadata);

      expect(result.tagMap['DATE']).toBe('2024');
      expect(result.tagMap['YEAR']).toBeUndefined();
      expect(result.tagMap['ALBUMARTIST']).toEqual(['New Artist']);
      expect(result.tagMap['ENSEMBLE']).toBeUndefined();
    });

    it('空文字列を指定した場合、そのタグが削除されること', () => {
      const rawData: RawFlacData = {
        path: '/path/to/audio.flac',
        tags: {
          TITLE: ['Existing Title'],
          ARTIST: ['Artist 1', 'Artist 2']
        },
        pictures: [],
        streamInfo: {}
      };

      const metadata: FlacMetadata = {
        title: '',
        artist: ['', '']
      };

      const result = mergeMetadataWithTags(rawData, metadata);

      expect(result.tagMap['TITLE']).toBeUndefined();
      expect(result.tagMap['ARTIST']).toBeUndefined();
    });

    it('画像データが正しくマージされること', () => {
      const rawData: RawFlacData = {
        path: '/path/to/audio.flac',
        tags: {},
        pictures: [],
        streamInfo: {}
      };

      const metadata: FlacMetadata = {};
      const picture = {
        mime: 'image/png',
        buffer: Buffer.from('dummy'),
        pictureType: 3
      };

      const result = mergeMetadataWithTags(rawData, metadata, picture);

      expect(result.picture).toEqual(picture);
    });
  });
});
