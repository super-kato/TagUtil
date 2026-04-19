/**
 * ファイル名として使用できない文字を置換し、前後の空白を削除します。
 * Windows や macOS/Linux で不適切な文字（\/ : * ? " < > |）を '_' に置き換えます。
 * @param filename 対象のファイル名
 * @returns サニタイズされたファイル名
 */
export const sanitize = (filename: string): string => {
  return filename.replace(/[\\/:*?"<>|]/g, '_').trim();
};
