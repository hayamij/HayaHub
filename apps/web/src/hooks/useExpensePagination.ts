import { useState, useEffect } from 'react';

export function useExpensePagination(itemsCount: number, pageSize: number = 20) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(itemsCount / pageSize);

  // Reset to page 1 when items count changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsCount]);

  const getPaginatedSlice = <T,>(items: T[]): T[] => {
    return items.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  return {
    currentPage,
    totalPages,
    pageSize,
    setCurrentPage: goToPage,
    nextPage,
    prevPage,
    getPaginatedSlice,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}
