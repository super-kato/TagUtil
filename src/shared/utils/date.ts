/**
 * ログ表示用の時刻フォーマット。
 * 日本時間 (Asia/Tokyo) で HH:mm:ss.SSS 形式を返します。
 */
export const formatLogTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
    hour12: false,
    timeZone: 'Asia/Tokyo'
  };

  return new Intl.DateTimeFormat('ja-JP', options).format(date);
};
