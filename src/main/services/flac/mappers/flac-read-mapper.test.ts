import { describe, it, expect } from 'vitest';
import { mapToFlacMetadata } from './flac-read-mapper';
import { RawFlacData } from '@services/flac/types';

describe('flac-read-mapper', () => {
  describe('mapToFlacMetadata', () => {
    it('標準的なタグが正しくマッピングされること', () => {
      const rawData: RawFlacData = {
        path: '/path/to/audio.flac',
        tags: {
          TITLE: ['Song Title'],
          ALBUM: ['Album Name'],
          DATE: ['2024'],
          TRACKNUMBER: ['1'],
          TRACKTOTAL: ['10'],
          DISCNUMBER: ['1'],
          DISCTOTAL: ['1'],
          CATALOGNUMBER: ['CAT-001']
        },
        pictures: [],
        streamInfo: {}
      };

      const result = mapToFlacMetadata(rawData, '/path/to/audio.flac');

      expect(result.title).toBe('Song Title');
      expect(result.album).toBe('Album Name');
      expect(result.date).toBe('2024');
      expect(result.trackNumber).toBe('1');
      expect(result.trackTotal).toBe('10');
      expect(result.discNumber).toBe('1');
      expect(result.discTotal).toBe('1');
      expect(result.catalogNumber).toBe('CAT-001');
    });

    it('複数値を持つタグが配列としてマッピングされること', () => {
      const rawData: RawFlacData = {
        path: '/path/to/audio.flac',
        tags: {
          ARTIST: ['Artist 1', 'Artist 2'],
          GENRE: ['Rock', 'Pop'],
          COMMENT: ['Comment 1', 'Comment 2'],
          ALBUMARTIST: ['Album Artist 1']
        },
        pictures: [],
        streamInfo: {}
      };

      const result = mapToFlacMetadata(rawData, '/path/to/audio.flac');

      expect(result.artist).toEqual(['Artist 1', 'Artist 2']);
      expect(result.genre).toEqual(['Rock', 'Pop']);
      expect(result.comment).toEqual(['Comment 1', 'Comment 2']);
      expect(result.albumArtist).toEqual(['Album Artist 1']);
    });

    it('別名（Synonyms）から値が読み取れること', () => {
      const rawData: RawFlacData = {
        path: '/path/to/audio.flac',
        tags: {
          YEAR: ['2023'], // DATE の別名
          ENSEMBLE: ['Ensemble Artist'] // ALBUMARTIST の別名
        },
        pictures: [],
        streamInfo: {}
      };

      const result = mapToFlacMetadata(rawData, '/path/to/audio.flac');

      expect(result.date).toBe('2023');
      expect(result.albumArtist).toEqual(['Ensemble Artist']);
    });

    it('標準タグと別名の両方がある場合、標準タグが優先されること', () => {
      const rawData: RawFlacData = {
        path: '/path/to/audio.flac',
        tags: {
          DATE: ['2024'],
          YEAR: ['2023']
        },
        pictures: [],
        streamInfo: {}
      };

      const result = mapToFlacMetadata(rawData, '/path/to/audio.flac');

      expect(result.date).toBe('2024');
    });

    it('タグが存在しないプロパティは undefined になること', () => {
      const rawData: RawFlacData = {
        path: '/path/to/audio.flac',
        tags: {},
        pictures: [],
        streamInfo: {}
      };

      const result = mapToFlacMetadata(rawData, '/path/to/audio.flac');

      expect(result.title).toBeUndefined();
      expect(result.artist).toBeUndefined();
    });

    it('画像情報が正しくマッピングされること', () => {
      const rawData: RawFlacData = {
        path: '/path/to/audio.flac',
        tags: {},
        pictures: [
          {
            mime: 'image/jpeg',
            buffer: new Uint8Array(),
            hash: 'dummy-hash'
          }
        ],
        streamInfo: {}
      };

      const result = mapToFlacMetadata(rawData, '/path/to/audio.flac');

      expect(result.picture).toBeDefined();
      expect(result.picture?.format).toBe('image/jpeg');
      expect(result.picture?.hash).toBe('dummy-hash');
    });
  });
});
