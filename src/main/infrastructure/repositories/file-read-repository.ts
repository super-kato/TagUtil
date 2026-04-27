import { computeMd5 } from '@main/utils/crypto';
import { readFile } from 'node:fs/promises';
import { FileContent } from './repository-types';

/**
 * 指定されたパスの JSON ファイルを読み込みます。
 */
export const readJsonFile = async <T>(filePath: string): Promise<T> => {
  const content = await readFile(filePath, 'utf8');
  return JSON.parse(content) as T;
};

/**
 * ファイルをバイナリとして読み込み、データとハッシュ値を返します。
 */
export const readFileWithHash = async (filePath: string): Promise<FileContent> => {
  const buffer = await readFile(filePath);
  return {
    buffer,
    hash: computeMd5(buffer)
  };
};
