import { computeMd5 } from '@main/utils/crypto';
import * as musicMetadata from 'music-metadata';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readRawFlacData } from './flac-read-repository';

vi.mock('music-metadata');
vi.mock('@main/utils/crypto');

describe('flac-read-repository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('FLAC ファイルからタグと画像を読み込み、RawFlacData 形式に変換すること', async () => {
    const mockMetadata = {
      native: {
        vorbis: [
          { id: 'TITLE', value: 'Test Title' },
          { id: 'ARTIST', value: 'Test Artist' },
          { id: 'METADATA_BLOCK_PICTURE', value: 'Should be ignored' }
        ]
      },
      common: {
        picture: [{ format: 'image/jpeg', data: Buffer.from('pic1') }]
      },
      format: {
        sampleRate: 44100,
        bitsPerSample: 16,
        numberOfChannels: 2,
        duration: 180
      }
    };

    vi.mocked(musicMetadata.parseFile).mockResolvedValue(
      Object.assign({} as musicMetadata.IAudioMetadata, mockMetadata)
    );
    vi.mocked(computeMd5).mockReturnValue('mock-hash');

    const result = await readRawFlacData('test.flac');

    expect(musicMetadata.parseFile).toHaveBeenCalledWith('test.flac');
    expect(result.tags).toEqual({
      TITLE: ['Test Title'],
      ARTIST: ['Test Artist']
    });
    expect(result.tags.METADATA_BLOCK_PICTURE).toBeUndefined(); // IGNORE_TAG_KEYS に含まれるため
    expect(result.pictures).toHaveLength(1);
    expect(result.pictures[0]).toEqual({
      mime: 'image/jpeg',
      buffer: mockMetadata.common.picture[0].data,
      hash: 'mock-hash'
    });
    expect(result.audioFormat).toEqual({
      sampleRate: 44100,
      bitDepth: 16,
      channels: 2,
      duration: 180
    });
  });

  it('タグや画像がない場合でも正しく動作すること', async () => {
    const mockMetadata = {
      native: {},
      common: {},
      format: {}
    };

    vi.mocked(musicMetadata.parseFile).mockResolvedValue(
      Object.assign({} as musicMetadata.IAudioMetadata, mockMetadata)
    );

    const result = await readRawFlacData('empty.flac');

    expect(result.tags).toEqual({});
    expect(result.pictures).toEqual([]);
  });
});
