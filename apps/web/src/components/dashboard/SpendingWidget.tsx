'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Container } from '@/infrastructure/di/Container';
import type { ExpenseDTO } from 'hayahub-business';

interface SpendingData {
  todayTotal: number;
  monthTotal: number;
  weeklyData: { date: string; amount: number }[];
  percentageChange: number;
  isIncrease: boolean;
}

interface SpendingWidgetProps {
  userId: string;
}

export function SpendingWidget({ userId }: SpendingWidgetProps) {
  const [data, setData] = useState<SpendingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadSpendingData();
  }, [userId]);

  const handleClick = () => {
    router.push('/spending');
  };

  const loadSpendingData = async () => {
    setIsLoading(true);
    try {
      const getExpensesUseCase = Container.getExpensesUseCase();
      
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
      
      // Get current month expenses
      const currentMonthResult = await getExpensesUseCase.execute({
        userId,
        startDate: startOfMonth,
        endDate: endOfMonth,
      });

      if (!currentMonthResult.isSuccess()) {
        setIsLoading(false);
        return;
      }

      const currentMonthExpenses = currentMonthResult.value;

      // Get previous month expenses for comparison
      const startOfPrevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const endOfPrevMonth = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999);
      
      const prevMonthResult = await getExpensesUseCase.execute({
        userId,
        startDate: startOfPrevMonth,
        endDate: endOfPrevMonth,
      });

      const prevMonthExpenses = prevMonthResult.isSuccess() ? prevMonthResult.value : [];

      // Calculate today's total
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
      
      const todayExpenses = currentMonthExpenses.filter((exp: ExpenseDTO) => {
        const expDate = new Date(exp.date);
        return expDate >= startOfDay && expDate <= endOfDay;
      });
      
      const todayTotal = todayExpenses.reduce((sum: number, exp: ExpenseDTO) => sum + exp.amount, 0);

      // Calculate month total
      const monthTotal = currentMonthExpenses.reduce((sum: number, exp: ExpenseDTO) => sum + exp.amount, 0);

      // Calculate weekly data (last 7 days)
      const weeklyData: { date: string; amount: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);
        
        const dayExpenses = currentMonthExpenses.filter((exp: ExpenseDTO) => {
          const expDate = new Date(exp.date);
          return expDate >= date && expDate <= endDate;
        });
        
        const dayTotal = dayExpenses.reduce((sum: number, exp: ExpenseDTO) => sum + exp.amount, 0);
        
        weeklyData.push({
          date: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
          amount: dayTotal,
        });
      }

      // Calculate percentage change compared to same day of previous month
      const currentDayOfMonth = today.getDate();
      
      // Get expenses up to current day in current month
      const currentMonthToDate = currentMonthExpenses.filter((exp: ExpenseDTO) => {
        const expDate = new Date(exp.date);
        return expDate.getDate() <= currentDayOfMonth;
      });
      
      const currentMonthTotalToDate = currentMonthToDate.reduce((sum: number, exp: ExpenseDTO) => sum + exp.amount, 0);
      
      // Get expenses up to same day in previous month
      const prevMonthToDate = prevMonthExpenses.filter((exp: ExpenseDTO) => {
        const expDate = new Date(exp.date);
        return expDate.getDate() <= currentDayOfMonth;
      });
      
      const prevMonthTotalToDate = prevMonthToDate.reduce((sum: number, exp: ExpenseDTO) => sum + exp.amount, 0);
      
      let percentageChange = 0;
      if (prevMonthTotalToDate > 0) {
        percentageChange = ((currentMonthTotalToDate - prevMonthTotalToDate) / prevMonthTotalToDate) * 100;
      } else if (currentMonthTotalToDate > 0) {
        percentageChange = 100;
      }

      setData({
        todayTotal,
        monthTotal,
        weeklyData,
        percentageChange,
        isIncrease: percentageChange > 0,
      });
    } catch (error) {
      console.error('Failed to load spending data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Không thể tải dữ liệu chi tiêu
        </p>
      </div>
    );
  }

  // Calculate max value for scaling the chart
  const maxAmount = Math.max(...data.weeklyData.map(d => d.amount), 1);

  return (
    <button
      onClick={handleClick}
      className="w-full bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-colors cursor-pointer text-left"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <TrendingUp className="w-5 h-5 text-gray-900 dark:text-white" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Chi tiêu hôm nay
          </h3>
        </div>
        
        {/* Percentage change */}
        <div className={`flex items-center gap-1 text-xs font-medium ${
          data.isIncrease 
            ? 'text-red-600 dark:text-red-400' 
            : 'text-green-600 dark:text-green-400'
        }`}>
          {data.isIncrease ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {Math.abs(data.percentageChange).toFixed(1)}%
        </div>
      </div>

      {/* Today's total */}
      <div className="mb-2">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {formatCurrency(data.todayTotal)}
        </p>
      </div>

      {/* Month total */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Tháng này: <span className="font-semibold text-gray-700 dark:text-gray-300">{formatCurrency(data.monthTotal)}</span>
        </p>
      </div>

      {/* Weekly chart */}
      <div className="space-y-2">
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          7 ngày qua
        </p>
        
        <div className="relative h-24 w-full">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Define gradient */}
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" className="text-gray-900 dark:text-gray-100" stopColor="currentColor" stopOpacity="0.3" />
                <stop offset="100%" className="text-gray-900 dark:text-gray-100" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Draw filled area under line */}
            <polygon
              fill="url(#areaGradient)"
              points={
                // Start from bottom-left, go through all points, end at bottom-right
                `0,100 ${data.weeklyData
                  .map((day, index) => {
                    const x = (index / (data.weeklyData.length - 1)) * 100;
                    const heightPercentage = maxAmount > 0 ? (day.amount / maxAmount) * 100 : 0;
                    const y = 100 - Math.max(heightPercentage, 5);
                    return `${x},${y}`;
                  })
                  .join(' ')} 100,100`
              }
            />
            
            {/* Draw line */}
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-900 dark:text-gray-100"
              points={data.weeklyData
                .map((day, index) => {
                  const x = (index / (data.weeklyData.length - 1)) * 100;
                  const heightPercentage = maxAmount > 0 ? (day.amount / maxAmount) * 100 : 0;
                  const y = 100 - Math.max(heightPercentage, 5);
                  return `${x},${y}`;
                })
                .join(' ')}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          
          {/* Hover areas and tooltips */}
          <div className="absolute inset-0 flex items-stretch pointer-events-none">
            {data.weeklyData.map((day, index) => (
              <div
                key={index}
                className="flex-1 relative group"
              >
                {/* Tooltip */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {formatCurrency(day.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Date labels */}
        <div className="flex justify-between px-1">
          {data.weeklyData.map((day, index) => (
            <span key={index} className="text-[10px] text-gray-400 dark:text-gray-500 text-center" style={{ width: `${100 / data.weeklyData.length}%` }}>
              {day.date}
            </span>
          ))}
        </div>
      </div>

      {/* Comparison note */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {data.isIncrease ? 'Tăng' : 'Giảm'} {Math.abs(data.percentageChange).toFixed(1)}% so với cùng kỳ tháng trước
        </p>
      </div>
    </button>
  );
}
