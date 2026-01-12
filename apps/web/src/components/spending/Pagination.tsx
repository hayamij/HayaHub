import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsCount: number;
  pageSize: number;
  itemLabel?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsCount,
  pageSize,
  itemLabel = 'giao dịch',
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, itemsCount);

  return (
    <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 order-2 sm:order-1">
          <span className="hidden sm:inline">Hiển thị {startItem} - {endItem} trong tổng số {itemsCount} {itemLabel}</span>
          <span className="sm:hidden">{startItem}-{endItem} / {itemsCount}</span>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Trước</span>
          </button>

          <div className="flex items-center gap-1">\n            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                // On mobile, show fewer page numbers
                const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
                const range = isMobile ? 0 : 1;
                return (
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= range
                );
              })
              .map((page, index, array) => {
                const prevPage = array[index - 1];
                const showEllipsis = prevPage && page - prevPage > 1;

                return (
                  <div key={page} className="flex items-center gap-1">
                    {showEllipsis && (
                      <span className="px-1 sm:px-2 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                        ...
                      </span>
                    )}
                    <button
                      onClick={() => onPageChange(page)}
                      className={`min-w-[32px] sm:min-w-[40px] px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                          : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      {page}
                    </button>
                  </div>
                );
              })}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span className="hidden sm:inline">Tiếp</span>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
