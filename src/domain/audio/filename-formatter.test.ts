import { describe, it, expect } from 'vitest';
import { formatFilename } from './filename-formatter';
import { AudioTrack } from './models';

describe('AudioFilenameFormatter', () => {
  const mockTrack: AudioTrack = {
    path: '/music/album/01 - test.flac',
    metadata: {
      title: 'Test Title',
      album: 'Test Album',
      artist: ['Artist A', 'Artist B'],
      trackNumber: '1',
      date: '2024',
      genre: ['Pop']
    }
  };

  it('プレースホルダをメタデータで置換すること', () => {
    const pattern = '{trackNumber} - {title}';
    const result = formatFilename(mockTrack, { pattern, trackNumberPadding: 2 });

    expect(result.type).toBe('success');
    if (result.type === 'success') {
      expect(result.value).toBe('01 - Test Title');
    }
  });

  it('複数のプレースホルダを置換すること', () => {
    const pattern = '{album} [{date}] {title}';
    const result = formatFilename(mockTrack, { pattern, trackNumberPadding: 2 });

    expect(result.type).toBe('success');
    if (result.type === 'success') {
      expect(result.value).toBe('Test Album [2024] Test Title');
    }
  });

  it('複数値のアーティストをカンマ区切りで置換すること', () => {
    const pattern = '{artist} - {title}';
    const result = formatFilename(mockTrack, { pattern, trackNumberPadding: 2 });

    expect(result.type).toBe('success');
    if (result.type === 'success') {
      expect(result.value).toBe('Artist A, Artist B - Test Title');
    }
  });

  it('不正な文字をサニタイズすること', () => {
    const trackWithBadChars: AudioTrack = {
      path: '/test.flac',
      metadata: {
        ...mockTrack.metadata,
        title: 'Title: with / slash'
      }
    };
    const pattern = '{title}';
    const result = formatFilename(trackWithBadChars, { pattern, trackNumberPadding: 2 });

    expect(result.type).toBe('success');
    if (result.type === 'success') {
      expect(result.value).not.toContain(':');
      expect(result.value).not.toContain('/');
    }
  });

  it('プレースホルダが含まれない場合にエラーを返すこと', () => {
    const pattern = 'fixed-name';
    const result = formatFilename(mockTrack, { pattern, trackNumberPadding: 2 });

    expect(result.type).toBe('error');
    if (result.type === 'error') {
      expect(result.error.type).toBe('INVALID_RENAME_PATTERN');
    }
  });

  it('必須タグが欠けている場合にエラーを返すこと', () => {
    const incompleteTrack: AudioTrack = {
      path: '/test.flac',
      metadata: {
        ...mockTrack.metadata,
        title: undefined
      }
    };
    const pattern = '{trackNumber} - {title}';
    const result = formatFilename(incompleteTrack, { pattern, trackNumberPadding: 2 });

    expect(result.type).toBe('error');
    if (result.type === 'error') {
      expect(result.error.type).toBe('MISSING_REQUIRED_TAG');
      expect(result.error.options.detail).toBe('{title}');
    }
  });
});
