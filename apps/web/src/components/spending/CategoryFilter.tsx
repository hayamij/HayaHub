import { useState } from 'react';
import { ExpenseCategory } from 'hayahub-domain';
import { Filter } from 'lucide-react';

interface CategoryFilterProps {
  categories: Array<{
    category: ExpenseCategory;
    total: number;
    count: number;
  }>;
  selectedCategory: ExpenseCategory | null;
  onCategoryClick: (category: ExpenseCategory) => void;
  categoryLabels: Record<ExpenseCategory, string>;
  formatCurrency: (amount: number) => string;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryClick,
  categoryLabels,
  formatCurrency,
}: CategoryFilterProps) {
  const [showAllCategories, setShowAllCategories] = useState(false);

  if (categories.length === 0) return null;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {categories.slice(0, 6).map((summary) => {
          const isSelected = selectedCategory === summary.category;
          return (
            <button
              key={summary.category}
              onClick={() => onCategoryClick(summary.category)}
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                isSelected
                  ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 ring-2 ring-gray-900 dark:ring-gray-100'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <span className="truncate max-w-[80px] sm:max-w-none">{categoryLabels[summary.category]}</span>
              <span
                className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs whitespace-nowrap ${
                  isSelected
                    ? 'bg-white/20 dark:bg-gray-900/20'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                {formatCurrency(summary.total)}
              </span>
            </button>
          );
        })}
        
        {categories.length > 6 && (
          <div className="relative">
            <button 
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Filter className="w-4 h-4" />
              +{categories.length - 6} khác
            </button>
            
            {/* Dropdown with remaining categories */}
            {showAllCategories && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 p-2 z-10">
                <div className="max-h-64 overflow-y-auto space-y-1">
                  {categories.slice(6).map((summary) => {
                    const isSelected = selectedCategory === summary.category;
                    return (
                      <button
                        key={summary.category}
                        onClick={() => {
                          onCategoryClick(summary.category);
                          setShowAllCategories(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                          isSelected
                            ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <span className="font-medium">{categoryLabels[summary.category]}</span>
                        <span className={`text-xs ${
                          isSelected ? 'text-white/80 dark:text-gray-900/80' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {formatCurrency(summary.total)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Overlay to close dropdown */}
      {showAllCategories && (
        <div 
          className="fixed inset-0 z-[5]" 
          onClick={() => setShowAllCategories(false)}
        />
      )}
    </>
  );
}
