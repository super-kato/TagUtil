const HEX_RADIX = 16;
const HEX_PADDING = 2;

/**
 * データを SHA-256 でハッシュ化し、16進数の文字列として返します。
 * ブラウザの Crypto API を使用します。
 */
export const computeSha256 = async (data: Uint8Array): Promise<string> => {
  const hashBuffer = await crypto.subtle.digest('SHA-256', data.buffer as ArrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(HEX_RADIX).padStart(HEX_PADDING, '0')).join('');
};
