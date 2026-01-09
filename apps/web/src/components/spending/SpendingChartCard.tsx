'use client';

import { useMemo } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { ExpenseCategory } from 'hayahub-domain';
import { filterByTimeView, type TimeView } from '@/lib/date-filter';

interface ExpenseRow {
  id: string;
  date: Date;
  description: string;
  amount: number;
  category: ExpenseCategory;
  notes: string;
}

interface SpendingChartCardProps {
  expenses: ExpenseRow[];
  timeView: TimeView;
  selectedDate: Date;
  onAddClick: () => void;
  isEditingDisabled: boolean;
}

export function SpendingChartCard({
  expenses,
  timeView,
  selectedDate,
  onAddClick,
  isEditingDisabled,
}: SpendingChartCardProps) {
  const chartData = useMemo(() => {
    // Group expenses by time unit based on timeView
    const data: { label: string; amount: number }[] = [];

    if (timeView === 'day') {
      // Hourly view for the day
      for (let hour = 0; hour < 24; hour++) {
        const hourStart = new Date(selectedDate);
        hourStart.setHours(hour, 0, 0, 0);
        const hourEnd = new Date(selectedDate);
        hourEnd.setHours(hour, 59, 59, 999);

        const hourExpenses = expenses.filter((exp) => {
          const expDate = new Date(exp.date);
          return expDate >= hourStart && expDate <= hourEnd;
        });

        const total = hourExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        data.push({
          label: `${hour.toString().padStart(2, '0')}h`,
          amount: total,
        });
      }
    } else if (timeView === 'month') {
      // Daily view for the month
      const daysInMonth = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        0
      ).getDate();

      for (let day = 1; day <= daysInMonth; day++) {
        const dayDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
        const dayStart = new Date(dayDate);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(dayDate);
        dayEnd.setHours(23, 59, 59, 999);

        const dayExpenses = expenses.filter((exp) => {
          const expDate = new Date(exp.date);
          return expDate >= dayStart && expDate <= dayEnd;
        });

        const total = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        data.push({
          label: day.toString(),
          amount: total,
        });
      }
    } else if (timeView === 'year') {
      // Monthly view for the year
      const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
      for (let month = 0; month < 12; month++) {
        const monthStart = new Date(selectedDate.getFullYear(), month, 1);
        const monthEnd = new Date(selectedDate.getFullYear(), month + 1, 0, 23, 59, 59, 999);

        const monthExpenses = expenses.filter((exp) => {
          const expDate = new Date(exp.date);
          return expDate >= monthStart && expDate <= monthEnd;
        });

        const total = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        data.push({
          label: months[month],
          amount: total,
        });
      }
    } else {
      // All time - group by month
      const monthGroups = new Map<string, number>();
      
      expenses.forEach((exp) => {
        const expDate = new Date(exp.date);
        const monthKey = `${expDate.getFullYear()}-${(expDate.getMonth() + 1).toString().padStart(2, '0')}`;
        const current = monthGroups.get(monthKey) || 0;
        monthGroups.set(monthKey, current + exp.amount);
      });

      // Sort by date and take last 12 months
      const sortedMonths = Array.from(monthGroups.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .slice(-12);

      sortedMonths.forEach(([monthKey, amount]) => {
        const [year, month] = monthKey.split('-');
        data.push({
          label: `${month}/${year.slice(2)}`,
          amount,
        });
      });
    }

    return data;
  }, [expenses, timeView, selectedDate]);

  // Calculate max for scaling
  const maxAmount = Math.max(...chartData.map((d) => d.amount), 1);
  
  // Calculate total based on timeView using shared utility
  const { total, transactionCount } = useMemo(() => {
    const filteredExpenses = filterByTimeView(expenses, timeView, selectedDate);

    return {
      total: filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0),
      transactionCount: filteredExpenses.length,
    };
  }, [expenses, timeView, selectedDate]);

  // Calculate average
//   const nonZeroData = chartData.filter((d) => d.amount > 0);
//   const average = nonZeroData.length > 0 ? total / nonZeroData.length : 0;

  // Get time period label
  const getTimePeriodLabel = (): string => {
    const date = selectedDate;
    switch (timeView) {
      case 'day': {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }
      case 'month':
        return `Tháng ${date.getMonth() + 1}/${date.getFullYear()}`;
      case 'year':
        return `Năm ${date.getFullYear()}`;
      case 'all':
        return 'Tất cả thời gian';
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Sample every nth point for better display
  const displayData = useMemo(() => {
    if (timeView === 'day') {
      // Show every 4 hours
      return chartData.filter((_, index) => index % 4 === 0);
    } else if (timeView === 'month') {
      // Show every 5 days
      return chartData.filter((_, index) => index % 5 === 0 || index === chartData.length - 1);
    }
    return chartData;
  }, [chartData, timeView]);

  return (
    <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left side - Info & Stats */}
        <div className="flex-shrink-0 lg:w-80">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <Calendar className="w-6 h-6 text-gray-900 dark:text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý Chi tiêu</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{getTimePeriodLabel()}</p>
            </div>
          </div>

          {/* Total */}
          <div className="mb-4">
            <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
              {formatCurrency(total)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {transactionCount} giao dịch
            </p>
          </div>

          {/* Stats badge
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
            <TrendingUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Trung bình</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {formatCurrency(average)}
              </p>
            </div>
          </div> */}

          {/* Action button */}
          <button
            onClick={onAddClick}
            disabled={isEditingDisabled}
            className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <Plus className="w-5 h-5" />
            Thêm chi tiêu
          </button>
        </div>

        {/* Right side - Chart */}
        <div className="flex-1 min-w-0">
          <div className="h-full flex flex-col justify-center">
            <div className="relative h-40 w-full">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Define gradient */}
                <defs>
                  <linearGradient id="spendingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop
                      offset="0%"
                      className="text-gray-900 dark:text-gray-100"
                      stopColor="currentColor"
                      stopOpacity="0.3"
                    />
                    <stop
                      offset="100%"
                      className="text-gray-900 dark:text-gray-100"
                      stopColor="currentColor"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                {/* Draw filled area under line */}
                {chartData.length > 0 && (
                  <polygon
                    fill="url(#spendingGradient)"
                    points={`0,100 ${chartData
                      .map((item, index) => {
                        const x = (index / (chartData.length - 1 || 1)) * 100;
                        const heightPercentage = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0;
                        const y = 100 - Math.max(heightPercentage, 2);
                        return `${x},${y}`;
                      })
                      .join(' ')} 100,100`}
                  />
                )}

                {/* Draw line */}
                {chartData.length > 0 && (
                  <polyline
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-gray-900 dark:text-gray-100"
                    points={chartData
                      .map((item, index) => {
                        const x = (index / (chartData.length - 1 || 1)) * 100;
                        const heightPercentage = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0;
                        const y = 100 - Math.max(heightPercentage, 2);
                        return `${x},${y}`;
                      })
                      .join(' ')}
                    vectorEffect="non-scaling-stroke"
                  />
                )}
              </svg>
            </div>

            {/* Labels */}
            <div className="flex justify-between px-1 mt-2">
              {displayData.map((item, index) => (
                <span
                  key={index}
                  className="text-[10px] text-gray-400 dark:text-gray-500 text-center"
                >
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
