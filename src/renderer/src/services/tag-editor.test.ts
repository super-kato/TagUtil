import { describe, it, expect } from 'vitest';
import { TrackRecord } from '@renderer/stores/track-record.svelte';
import { tagEditor } from './tag-editor';
import type { FlacMetadata } from '@domain/flac/models';

describe('tagEditor', () => {
  const createMockTrack = (path: string, genre: string[] = []): TrackRecord => {
    const metadata: FlacMetadata = {
      title: 'Title',
      album: 'Album',
      artist: ['Artist'],
      albumArtist: ['Artist'],
      genre,
      trackNumber: '1',
      trackTotal: '1',
      discNumber: '1',
      discTotal: '1',
      date: '2024',
      catalogNumber: 'CAT-001',
      streamInfo: {
        sampleRate: 44100,
        channels: 2,
        bitDepth: 16,
        duration: 100
      }
    };
    return new TrackRecord(path, metadata);
  };

  describe('addMultiFieldValue', () => {
    it('新しい値を複数値フィールドの末尾に追加すること', () => {
      const track = createMockTrack('file1.flac', ['Rock']);
      tagEditor.addMultiFieldValue([track], 'genre', 'Pop');
      expect(track.metadata.genre).toStrictEqual(['Rock', 'Pop']);
    });

    it('既に存在する値は重複して追加しないこと', () => {
      const track = createMockTrack('file1.flac', ['Rock', 'Pop']);
      tagEditor.addMultiFieldValue([track], 'genre', 'Rock');
      expect(track.metadata.genre).toStrictEqual(['Rock', 'Pop']);
    });

    it('空の配列に対しても正しく追加できること', () => {
      const track = createMockTrack('file1.flac', []);
      tagEditor.addMultiFieldValue([track], 'genre', 'Jazz');
      expect(track.metadata.genre).toStrictEqual(['Jazz']);
    });
  });

  describe('removeMultiFieldValue', () => {
    it('指定した値をフィールドから削除すること', () => {
      const track = createMockTrack('file1.flac', ['Rock', 'Pop', 'Jazz']);
      tagEditor.removeMultiFieldValue([track], 'genre', 'Pop');
      expect(track.metadata.genre).toStrictEqual(['Rock', 'Jazz']);
    });

    it('該当する値が複数ある場合、すべて削除すること', () => {
      const track = createMockTrack('file1.flac', ['Rock', 'Pop', 'Rock']);
      tagEditor.removeMultiFieldValue([track], 'genre', 'Rock');
      expect(track.metadata.genre).toStrictEqual(['Pop']);
    });

    it('存在しない値を削除しようとしても変化がないこと', () => {
      const track = createMockTrack('file1.flac', ['Rock']);
      tagEditor.removeMultiFieldValue([track], 'genre', 'Pop');
      expect(track.metadata.genre).toStrictEqual(['Rock']);
    });
  });

  describe('updateMultiField', () => {
    it('指定したインデックスの値を更新すること', () => {
      const track = createMockTrack('file1.flac', ['Rock', 'Pop']);
      tagEditor.updateMultiField([track], 'genre', 1, 'Jazz');
      expect(track.metadata.genre).toStrictEqual(['Rock', 'Jazz']);
    });
  });

  describe('applyPicture', () => {
    it('すべてのトラックに同じ画像情報を適用すること', () => {
      const tracks = [createMockTrack('file1.flac'), createMockTrack('file2.flac')];
      const picture = {
        format: 'image/jpeg',
        sourcePath: '/path/to/image.jpg',
        hash: 'mock-hash'
      };

      tagEditor.applyPicture(tracks, picture);

      expect(tracks[0].metadata.picture).toStrictEqual(picture);
      expect(tracks[1].metadata.picture).toStrictEqual(picture);
    });
  });

  describe('removePicture', () => {
    it('すべてのトラックから画像を削除すること', () => {
      const tracks = [createMockTrack('file1.flac')];
      tracks[0].metadata.picture = {
        format: 'image/jpeg',
        sourcePath: '/path/to/image.jpg',
        hash: 'mock-hash'
      };

      tagEditor.removePicture(tracks);

      expect(tracks[0].metadata.picture).toBeNull();
    });
  });
});
