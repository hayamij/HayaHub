import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import type { TimeView } from '@/lib/date-filter';

interface TotalAmountCardProps {
  totalAmount: number;
  transactionCount: number;
  yearPercentage: number;
  yearIsIncrease: boolean;
  prevYearAmount: number;
  timeView: TimeView;
  selectedYear: number;
  formatCurrency: (amount: number) => string;
}

export function TotalAmountCard({
  totalAmount,
  transactionCount,
  yearPercentage,
  yearIsIncrease,
  prevYearAmount,
  timeView,
  selectedYear,
  formatCurrency,
}: TotalAmountCardProps) {
  const averagePerTransaction = transactionCount > 0 ? totalAmount / transactionCount : 0;
  const showComparison = timeView !== 'all' && yearPercentage > 0;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {timeView === 'all' 
              ? 'Tổng chi tiêu - Tất cả thời gian'
              : `Tổng chi tiêu - Năm ${selectedYear}`
            }
          </h3>
        </div>
        
        {showComparison && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            yearIsIncrease 
              ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
              : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
          }`}>
            {yearIsIncrease ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {yearPercentage.toFixed(1)}%
          </div>
        )}
      </div>
      
      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {formatCurrency(totalAmount)}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
        {transactionCount} giao dịch
      </p>

      <div className="border-t border-gray-200 dark:border-gray-800 my-3" />

      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">Trung bình/GD</span>
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          {formatCurrency(averagePerTransaction)}
        </span>
      </div>

      {showComparison && (
        <div className="mt-2 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Cùng kỳ năm {selectedYear - 1}
            </span>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {formatCurrency(prevYearAmount)}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {yearIsIncrease ? 'Tăng' : 'Giảm'} {yearPercentage.toFixed(1)}% so với cùng kỳ năm trước
          </p>
        </div>
      )}
    </div>
  );
}
