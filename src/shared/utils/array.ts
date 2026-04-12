/**
 * 2つの値が一致するか、配列の場合はその内容（順序含む）が一致するかどうかを判定します。
 */
export const arraysEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) {
    return true;
  }
  if (!Array.isArray(a) || !Array.isArray(b)) {
    return false;
  }
  if (a.length !== b.length) {
    return false;
  }
  return a.every((val, index) => val === b[index]);
};
