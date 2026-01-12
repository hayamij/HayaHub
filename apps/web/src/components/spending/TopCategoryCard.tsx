import { TrendingUp } from 'lucide-react';
import { ExpenseCategory } from 'hayahub-domain';

interface TopCategoryCardProps {
  category: ExpenseCategory;
  total: number;
  count: number;
  totalAmount: number;
  categoryLabel: string;
  formatCurrency: (amount: number) => string;
}

export function TopCategoryCard({
  category,
  total,
  count,
  totalAmount,
  categoryLabel,
  formatCurrency,
}: TopCategoryCardProps) {
  const percentage = totalAmount > 0 ? (total / totalAmount) * 100 : 0;
  const averagePerTransaction = count > 0 ? total / count : 0;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Chi nhiều nhất
        </h3>
      </div>
      
      <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">
        {categoryLabel}
      </p>
      <p className="text-xl font-semibold text-amber-600 dark:text-amber-400 mb-3">
        {formatCurrency(total)}
      </p>

      <div className="border-t border-gray-200 dark:border-gray-800 my-3" />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">Số giao dịch</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {count}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">% tổng chi tiêu</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {percentage.toFixed(1)}%
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">TB/giao dịch</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {formatCurrency(averagePerTransaction)}
          </span>
        </div>
      </div>
    </div>
  );
}
