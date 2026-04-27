import { withAtomicWrite } from '@main/infrastructure/repositories/file/file-write-repository';
import { FlacTagMap, FlacTags, writeFlacTags } from 'flac-tagger';
import {
  PICTURE_TYPE_FRONT_COVER,
  RawFlacTags,
  RawPicture,
  VorbisTags
} from '@main/infrastructure/repositories/repository-types';

/**
 * 指定されたパスのFLACファイルへタグを書き込みます。
 * アトミックな書き込みを保証します。
 */
export const writeFlacTagsWithAtomic = async (
  filePath: string,
  data: RawFlacTags
): Promise<void> => {
  const libTags: FlacTags = {
    tagMap: mapRawTagsToLib(data.tags),
    picture: mapRawPicturesToLib(data.pictures)
  };

  await withAtomicWrite(filePath, async (tempPath) => {
    await writeFlacTags(libTags, tempPath);
  });
};

/**
 * 内部タグ形式をライブラリのタグマップ形式に変換します。
 */
const mapRawTagsToLib = (tags: VorbisTags): FlacTagMap => {
  const map: FlacTagMap = {};
  for (const [key, values] of Object.entries(tags)) {
    map[key] = values.length === 1 ? values[0] : values;
  }
  return map;
};

/**
 * 独自の画像型をライブラリの型へ変換します。
 */
const mapRawPicturesToLib = (pictures: RawPicture[]): FlacTags['picture'] => {
  const p = pictures[0];
  if (!p) {
    return undefined;
  }

  return {
    mime: p.mime,
    description: '',
    pictureType: PICTURE_TYPE_FRONT_COVER,
    buffer: Buffer.from(p.buffer)
  };
};
