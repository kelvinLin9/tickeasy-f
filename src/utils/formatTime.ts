export const formatLocalTime = (dateString: string) => {
  if (!dateString) return "";

  // 判斷是否為 UTC 格式（有 Z 或 +00:00 結尾）
  const isUTC = /Z$|\\+00:00$/.test(dateString);

  let date = new Date(dateString);
  if (!isUTC) {
    // 只對 UTC 時間加 8 小時
    date = new Date(date.getTime() + 8 * 60 * 60 * 1000);
  }
  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

export const formatLocalTimeToDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};
