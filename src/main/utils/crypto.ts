import { createHash } from 'node:crypto';
import { generateId as sharedGenerateId } from '@shared/utils/id';

/**
 * 指定されたバイナリデータのMD5ハッシュ値を計算します。
 * @param buffer 計算対象のバイナリデータ
 * @returns 16進数文字列形式のハッシュ値
 */
export const computeMd5 = (buffer: Uint8Array): string => {
  return createHash('md5').update(buffer).digest('hex');
};

/**
 * 一意な識別子（UUID v4）を生成します。
 * @returns UUID 文字列
 */
export const generateId = (): string => {
  return sharedGenerateId();
};
