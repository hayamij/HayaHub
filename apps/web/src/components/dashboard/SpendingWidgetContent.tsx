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

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">Hôm nay</div>
          <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
            {data.todayTotal.toLocaleString()} đ
          </div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
          <div className="text-xs text-purple-600 dark:text-purple-400 mb-1">Tháng này</div>
          <div className="text-lg font-bold text-purple-700 dark:text-purple-300">
            {data.monthTotal.toLocaleString()} đ
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-600 dark:text-gray-400">7 ngày qua</span>
          <div
            className={`flex items-center gap-1 text-xs ${
              data.isIncrease ? 'text-red-500' : 'text-green-500'
            }`}
          >
            {data.isIncrease ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {data.percentageChange.toFixed(1)}%
          </div>
        </div>
        <div className="flex items-end justify-between gap-1 h-20">
          {data.weeklyData.map((day, index) => (
            <div key={index} className="flex flex-col items-center flex-1 gap-1">
              <div className="text-[10px] text-gray-500 dark:text-gray-400">{day.date}</div>
              <div
                className="w-full bg-blue-500 dark:bg-blue-400 rounded-t transition-all hover:bg-blue-600"
                style={{ height: `${(day.amount / maxAmount) * 100}%`, minHeight: '2px' }}
                title={`${day.amount.toLocaleString()} đ`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
