import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resolvePictureForWrite } from './flac-write-picture-resolver';
import * as fileReadRepo from '@main/infrastructure/repositories/file/file-read-repository';
import { Picture } from '@domain/flac/models';
import { RawFlacData } from '@main/infrastructure/repositories/repository-types';

vi.mock('@main/infrastructure/repositories/file/file-read-repository');

describe('flac-write-picture-resolver', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockRawData: RawFlacData = {
    path: '/path/to/music.flac',
    audioFormat: {},
    tags: {},
    pictures: [{ buffer: new Uint8Array([1]), mime: 'image/jpeg', hash: 'hash1' }]
  };

  it('nullが渡された場合、undefined（削除）を返すこと', async () => {
    const result = await resolvePictureForWrite(null, mockRawData);
    expect(result).toBeUndefined();
  });

  it('undefinedが渡された場合、既存の画像を返すこと', async () => {
    const result = await resolvePictureForWrite(undefined, mockRawData);
    expect(result).toEqual(mockRawData.pictures[0]);
  });

  it('sourcePathがFLACファイル自身を指している場合、既存の画像を返すこと', async () => {
    const intent: Picture = {
      sourcePath: '/path/to/music.flac',
      format: 'image/jpeg',
      hash: 'hash1'
    };
    const result = await resolvePictureForWrite(intent, mockRawData);
    expect(result).toEqual(mockRawData.pictures[0]);
  });

  it('外部ファイルが指定された場合、そのファイルを読み込んで返すこと', async () => {
    const intent: Picture = {
      sourcePath: '/path/to/new.jpg',
      format: 'image/jpeg',
      hash: 'hash2'
    };
    const mockContent = { buffer: new Uint8Array([2]), hash: 'hash2' };
    vi.mocked(fileReadRepo.readFileWithHash).mockResolvedValue(mockContent);

    const result = await resolvePictureForWrite(intent, mockRawData);

    expect(fileReadRepo.readFileWithHash).toHaveBeenCalledWith('/path/to/new.jpg');
    expect(result).toEqual({ mime: 'image/jpeg', ...mockContent });
  });
});
