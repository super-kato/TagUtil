import { withAtomicWrite } from '@main/infrastructure/repositories/file/file-write-repository';
import { RawFlacTags } from '@main/infrastructure/repositories/repository-types';
import { writeFlacTags } from 'flac-tagger';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { writeFlacTagsWithAtomic } from './flac-write-repository';

vi.mock('flac-tagger');
vi.mock('@main/infrastructure/repositories/file/file-write-repository');

describe('flac-write-repository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('アトミック書き込みを利用して FLAC タグを書き込むこと', async () => {
    const filePath = 'test.flac';
    const data: RawFlacTags = {
      tags: {
        TITLE: ['New Title'],
        ARTIST: ['New Artist']
      },
      pictures: [{ mime: 'image/png', buffer: Buffer.from('pic'), hash: 'hash' }]
    };

    // withAtomicWrite のモック実装: コールバックを即座に実行する
    vi.mocked(withAtomicWrite).mockImplementation(async (_path, cb) => {
      await cb('temp.flac');
    });

    await writeFlacTagsWithAtomic(filePath, data);

    expect(withAtomicWrite).toHaveBeenCalledWith(filePath, expect.any(Function));
    expect(writeFlacTags).toHaveBeenCalledWith(
      expect.objectContaining({
        tagMap: {
          TITLE: 'New Title',
          ARTIST: 'New Artist'
        },
        picture: expect.objectContaining({
          mime: 'image/png',
          buffer: data.pictures[0].buffer
        })
      }),
      'temp.flac'
    );
  });

  it('画像がない場合に picture が undefined になること', async () => {
    vi.mocked(withAtomicWrite).mockImplementation(async (_path, cb) => {
      await cb('temp.flac');
    });

    await writeFlacTagsWithAtomic('test.flac', { tags: { T: ['V'] }, pictures: [] });

    expect(writeFlacTags).toHaveBeenCalledWith(
      expect.objectContaining({
        picture: undefined
      }),
      'temp.flac'
    );
  });
});
