import { describe, it, expect } from 'vitest';
import { formatFlacFilename } from './filename-formatter';
import type { FlacTrack } from './types';

describe('filename-formatter', () => {
  const createMockTrack = (
    trackNumber: string | undefined,
    title: string | undefined
  ): FlacTrack => ({
    path: '/path/to/music.flac',
    metadata: {
      trackNumber,
      title
    }
  });

  describe('formatFlacFilename', () => {
    it('トラック番号とタイトルがある場合、正しくフォーマットされること', () => {
      const track = createMockTrack('1', 'Song Title');
      const result = formatFlacFilename(track);

      expect(result.type).toBe('success');
      if (result.type === 'success') {
        expect(result.value).toBe('01 - Song Title.flac');
      }
    });

    it('トラック番号が2桁以上の場合、そのまま表示されること', () => {
      const track = createMockTrack('12', 'Longer Track');
      const result = formatFlacFilename(track);

      expect(result.type).toBe('success');
      if (result.type === 'success') {
        expect(result.value).toBe('12 - Longer Track.flac');
      }
    });

    it('メタデータに禁止文字が含まれる場合、サニタイズされること', () => {
      const track = createMockTrack('1', 'What?');
      const result = formatFlacFilename(track);

      expect(result.type).toBe('success');
      if (result.type === 'success') {
        expect(result.value).toBe('01 - What_.flac');
      }
    });

    it('トラック番号に禁止文字が含まれる場合でもサニタイズされること', () => {
      const track = createMockTrack('1/2', 'Test');
      const result = formatFlacFilename(track);

      expect(result.type).toBe('success');
      if (result.type === 'success') {
        expect(result.value).toBe('1_2 - Test.flac');
      }
    });

    it('トラック番号が欠損している場合、エラーを返却すること', () => {
      const track = createMockTrack(undefined, 'Title Only');
      const result = formatFlacFilename(track);

      expect(result.type).toBe('error');
      if (result.type === 'error') {
        expect(result.error.type).toBe('MISSING_TRACK_NUMBER');
      }
    });

    it('タイトルが欠損している場合、エラーを返却すること', () => {
      const track = createMockTrack('5', undefined);
      const result = formatFlacFilename(track);

      expect(result.type).toBe('error');
      if (result.type === 'error') {
        expect(result.error.type).toBe('MISSING_TITLE');
      }
    });
  });
});
