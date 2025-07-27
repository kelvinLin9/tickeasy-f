export const formatNumberToPrice = (locale: string, number: number, digital: number) => {
  return number.toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: digital,
  });
};
