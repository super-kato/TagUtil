import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { isHiddenPath, isSupportedAudioFile } from './file-utils';

describe('file-utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('isHiddenPath', () => {
    it('ドットで始まるファイル名を隠しファイルと判定すること', () => {
      expect(isHiddenPath('.hidden')).toBe(true);
      expect(isHiddenPath('/path/to/.hidden')).toBe(true);
    });

    it('ドットで始まらないファイル名は隠しファイルと判定しないこと', () => {
      expect(isHiddenPath('visible.txt')).toBe(false);
      expect(isHiddenPath('/path/to/visible.flac')).toBe(false);
    });
  });

  describe('isSupportedAudioFile', () => {
    it('.flac 拡張子をサポート対象として判定すること', () => {
      expect(isSupportedAudioFile('song.flac')).toBe(true);
      expect(isSupportedAudioFile('song.FLAC')).toBe(true);
    });

    it('.flac 以外の拡張子はサポート対象外として判定すること', () => {
      expect(isSupportedAudioFile('song.mp3')).toBe(false);
      expect(isSupportedAudioFile('song.wav')).toBe(false);
      expect(isSupportedAudioFile('song')).toBe(false);
    });
  });
});
