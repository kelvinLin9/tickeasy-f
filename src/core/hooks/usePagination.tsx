import { useState } from "react";

interface UsePaginationProps {
  totalItems: number; // 總筆數
  itemsPerPage?: number; // 每頁幾筆，預設10
}

export function usePagination({ totalItems, itemsPerPage = 10 }: UsePaginationProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  };

  const goNext = () => goToPage(currentPage + 1);

  const goPrev = () => goToPage(currentPage - 1);

  return {
    currentPage,
    totalPages,
    goToPage,
    goNext,
    goPrev,
  };
}
