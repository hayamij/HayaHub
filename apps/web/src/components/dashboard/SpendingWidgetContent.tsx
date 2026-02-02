'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useMonthExpenses, useTodayExpenses } from '@/hooks/useExpenses';

interface SpendingData {
  todayTotal: number;
  monthTotal: number;
  weeklyData: { date: string; amount: number }[];
  percentageChange: number;
  isIncrease: boolean;
}

interface SpendingWidgetContentProps {
  userId: string;
}

export default function SpendingWidgetContent({ userId }: SpendingWidgetContentProps) {
  const [data, setData] = useState<SpendingData | null>(null);

  const { expenses: currentMonthExpenses, isLoading: isLoadingCurrent } = useMonthExpenses(userId);
  const { expenses: todayExpenses } = useTodayExpenses(userId);
  
  const today = new Date();
  const { expenses: prevMonthExpenses } = useMonthExpenses(
    userId,
    today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear(),
    today.getMonth() === 0 ? 11 : today.getMonth() - 1
  );

  useEffect(() => {
    if (isLoadingCurrent) return;

    const today = new Date();
    const todayTotal = todayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const monthTotal = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    const weeklyData: { date: string; amount: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      const dayExpenses = currentMonthExpenses.filter((exp) => {
        const expDate = new Date(exp.date);
        return expDate >= date && expDate <= endDate;
      });
      
      const dayTotal = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      
      weeklyData.push({
        date: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        amount: dayTotal,
      });
    }

    const currentDayOfMonth = today.getDate();
    const currentMonthToDate = currentMonthExpenses.filter((exp) => {
      const expDate = new Date(exp.date);
      return expDate.getDate() <= currentDayOfMonth;
    }).reduce((sum, exp) => sum + exp.amount, 0);

    const prevMonthToDate = prevMonthExpenses.filter((exp) => {
      const expDate = new Date(exp.date);
      return expDate.getDate() <= currentDayOfMonth;
    }).reduce((sum, exp) => sum + exp.amount, 0);

    const change = prevMonthToDate === 0 ? 0 : ((currentMonthToDate - prevMonthToDate) / prevMonthToDate) * 100;

    setData({
      todayTotal,
      monthTotal,
      weeklyData,
      percentageChange: Math.abs(change),
      isIncrease: change > 0,
    });
  }, [currentMonthExpenses, todayExpenses, prevMonthExpenses, isLoadingCurrent]);

  if (isLoadingCurrent || !data) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-400">Đang tải...</div>
      </div>
    );
  }

  const maxAmount = Math.max(...data.weeklyData.map((d) => d.amount), 1);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="h-full flex flex-col p-4">
      {/* Header with percentage */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Chi tiêu
        </h3>
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

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Hôm nay</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {formatCurrency(data.todayTotal)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tháng này</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {formatCurrency(data.monthTotal)}
          </p>
        </div>
      </div>

      {/* Line chart */}
      <div className="flex-1 space-y-2">
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          7 ngày qua
        </p>
        
        <div className="relative h-32 w-full">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="spendingAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" className="text-gray-900 dark:text-gray-100" stopColor="currentColor" stopOpacity="0.3" />
                <stop offset="100%" className="text-gray-900 dark:text-gray-100" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Area under line */}
            <polygon
              fill="url(#spendingAreaGradient)"
              points={
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
            
            {/* Line */}
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
          
          {/* Hover tooltips */}
          <div className="absolute inset-0 flex items-stretch pointer-events-none">
            {data.weeklyData.map((day, index) => (
              <div
                key={index}
                className="flex-1 relative group"
              >
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

      {/* Comparison */}
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {data.isIncrease ? 'Tăng' : 'Giảm'} {Math.abs(data.percentageChange).toFixed(1)}% so với cùng kỳ tháng trước
        </p>
      </div>
    </div>
  );
}
