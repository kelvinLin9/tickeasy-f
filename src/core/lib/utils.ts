import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 生成帶有 ellipsis 的頁碼列

export function generatePaginationRange(currentPage: number, totalPages: number) {
  const delta = 2; // 當前頁碼前後要顯示幾個
  const range: (number | "ellipsis")[] = [];
  const rangeWithDots: (number | "ellipsis")[] = [];
  let l: number | undefined;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
      range.push(i);
    }
  }

  for (const i of range) {
    if (l !== undefined) {
      if ((i as number) - (l as number) === 2) {
        rangeWithDots.push(l + 1);
      } else if ((i as number) - (l as number) !== 1) {
        rangeWithDots.push("ellipsis");
      }
    }
    rangeWithDots.push(i);
    l = i as number;
  }

  return rangeWithDots;
}
