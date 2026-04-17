/**
 * 指定された数値を min 以上 max 以下の範囲に収めます。
 * @param value 対象の数値
 * @param min 最小値
 * @param max 最大値
 * @returns 範囲内に収められた数値
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};
