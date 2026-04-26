import { describe, it, expect } from 'vitest';
import { formatFlacFilename } from './filename-formatter';
import { TAG_PLACEHOLDERS } from './constants';
import type { FlacTrack } from './models';

describe('filename-formatter', () => {
  const createMockTrack = (
    trackNumber: string | undefined,
    title: string | undefined,
    album?: string,
    artist?: string[],
    date?: string,
    genre?: string[]
  ): FlacTrack => ({
    path: '/path/to/music.flac',
    metadata: {
      trackNumber,
      title,
      album,
      artist,
      date,
      genre
    }
  });

  const DEFAULT_PATTERN = `${TAG_PLACEHOLDERS.TRACK_NUMBER} - ${TAG_PLACEHOLDERS.TITLE}`;
  const DEFAULT_PADDING = 2;

  describe('formatFlacFilename', () => {
    it('トラック番号とタイトルがある場合、正しくフォーマットされること', () => {
      const track = createMockTrack('1', 'Song Title');
      const result = formatFlacFilename(track, {
        pattern: DEFAULT_PATTERN,
        trackNumberPadding: DEFAULT_PADDING
      });

      expect(result.type).toBe('success');
      if (result.type === 'success') {
        expect(result.value).toBe('01 - Song Title');
      }
    });

    it('トラック番号が2桁以上の場合、そのまま表示されること', () => {
      const track = createMockTrack('12', 'Longer Track');
      const result = formatFlacFilename(track, {
        pattern: DEFAULT_PATTERN,
        trackNumberPadding: DEFAULT_PADDING
      });

      expect(result.type).toBe('success');
      if (result.type === 'success') {
        expect(result.value).toBe('12 - Longer Track');
      }
    });

    it('カスタムパディングが適用されること', () => {
      const track = createMockTrack('1', 'Song Title');
      const result = formatFlacFilename(track, { pattern: DEFAULT_PATTERN, trackNumberPadding: 3 });

      expect(result.type).toBe('success');
      if (result.type === 'success') {
        expect(result.value).toBe('001 - Song Title');
      }
    });

    it('アルバム名を含むカスタムパターンが機能すること', () => {
      const track = createMockTrack('1', 'Title', 'My Album');
      const result = formatFlacFilename(track, {
        pattern: `${TAG_PLACEHOLDERS.ALBUM} - ${TAG_PLACEHOLDERS.TRACK_NUMBER} - ${TAG_PLACEHOLDERS.TITLE}`,
        trackNumberPadding: 2
      });

      expect(result.type).toBe('success');
      if (result.type === 'success') {
        expect(result.value).toBe('My Album - 01 - Title');
      }
    });

    it('複数値のアーティストが正しく結合されること', () => {
      const track = createMockTrack('1', 'Title', undefined, ['Artist A', 'Artist B']);
      const result = formatFlacFilename(track, {
        pattern: `${TAG_PLACEHOLDERS.ARTIST} - ${TAG_PLACEHOLDERS.TITLE}`,
        trackNumberPadding: 2
      });

      expect(result.type).toBe('success');
      if (result.type === 'success') {
        expect(result.value).toBe('Artist A, Artist B - Title');
      }
    });

    it('メタデータに禁止文字が含まれる場合、サニタイズされること', () => {
      const track = createMockTrack('1', 'What?');
      const result = formatFlacFilename(track, {
        pattern: DEFAULT_PATTERN,
        trackNumberPadding: DEFAULT_PADDING
      });

      expect(result.type).toBe('success');
      if (result.type === 'success') {
        expect(result.value).toBe('01 - What_');
      }
    });

    it('トラック番号が欠損しているがパターンに含まれていない場合、成功すること', () => {
      const track = createMockTrack(undefined, 'Title Only');
      const result = formatFlacFilename(track, {
        pattern: TAG_PLACEHOLDERS.TITLE,
        trackNumberPadding: 2
      });

      expect(result.type).toBe('success');
      if (result.type === 'success') {
        expect(result.value).toBe('Title Only');
      }
    });

    it('パターンに含まれるトラック番号が欠損している場合、エラーを返却すること', () => {
      const track = createMockTrack(undefined, 'Title');
      const result = formatFlacFilename(track, {
        pattern: DEFAULT_PATTERN,
        trackNumberPadding: DEFAULT_PADDING
      });

      expect(result.type).toBe('error');
      if (result.type === 'error') {
        expect(result.error.type).toBe('MISSING_REQUIRED_TAG');
        expect(result.error.options.detail).toBe(TAG_PLACEHOLDERS.TRACK_NUMBER);
      }
    });

    it('パターンに含まれるタイトルが欠損している場合、エラーを返却すること', () => {
      const track = createMockTrack('1', undefined);
      const result = formatFlacFilename(track, {
        pattern: DEFAULT_PATTERN,
        trackNumberPadding: DEFAULT_PADDING
      });

      expect(result.type).toBe('error');
      if (result.type === 'error') {
        expect(result.error.type).toBe('MISSING_REQUIRED_TAG');
        expect(result.error.options.detail).toBe(TAG_PLACEHOLDERS.TITLE);
      }
    });

    it('パターンにアルバム名が欠損している場合、エラーを返却すること', () => {
      const track = createMockTrack('1', 'Title', undefined);
      const result = formatFlacFilename(track, {
        pattern: `${TAG_PLACEHOLDERS.ALBUM} - ${TAG_PLACEHOLDERS.TITLE}`,
        trackNumberPadding: 2
      });

      expect(result.type).toBe('error');
      if (result.type === 'error') {
        expect(result.error.type).toBe('MISSING_REQUIRED_TAG');
        expect(result.error.options.detail).toBe(TAG_PLACEHOLDERS.ALBUM);
      }
    });

    it('パターンに一つもタグが含まれていない場合、エラーを返却すること', () => {
      const track = createMockTrack('1', 'Title');
      const result = formatFlacFilename(track, {
        pattern: 'fixed-filename',
        trackNumberPadding: 2
      });

      expect(result.type).toBe('error');
      if (result.type === 'error') {
        expect(result.error.type).toBe('INVALID_RENAME_PATTERN');
      }
    });
  });
});
