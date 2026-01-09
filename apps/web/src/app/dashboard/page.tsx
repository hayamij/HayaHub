'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SpendingWidget } from '@/components/dashboard/SpendingWidget';
import { AddExpenseModal } from '@/components/dashboard/AddExpenseModal';
import { useAuth } from '@/contexts/AuthContext';
import { useSyncStatus } from '@/hooks/useSyncStatus';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { Plus, TrendingUp, /*TrendingDown,*/ FileText, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Container } from '@/infrastructure/di/Container';

export default function DashboardPage() {
  const { user } = useAuth();
  const { isSyncing, queueSize } = useSyncStatus();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [stats, setStats] = useState({
    today: { income: 0, expense: 0 },
    week: { income: 0, expense: 0 },
    month: { income: 0, expense: 0 },
  });

  const handleExpenseAdded = () => {
    // Refresh spending widget and stats by changing key
    setRefreshKey(prev => prev + 1);
    loadStats();
  };


  const loadStats = useCallback(async () => {
    if (!user) return;

    try {
      const getExpensesUseCase = Container.getExpensesUseCase();
      const now = new Date();

      // Get all expenses for the month to filter locally
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      
      const result = await getExpensesUseCase.execute({
        userId: user.id,
        startDate: startOfMonth,
        endDate: endOfMonth,
      });

      if (result.isSuccess()) {
        const expenses = result.value;

        // Calculate today
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date(now);
        todayEnd.setHours(23, 59, 59, 999);
        const todayExpenses = expenses.filter(exp => {
          const expDate = new Date(exp.date);
          return expDate >= todayStart && expDate <= todayEnd;
        });
        const todayTotal = todayExpenses.reduce((sum, exp) => sum + exp.amount, 0);

        // Calculate this week (Monday to Sunday)
        const dayOfWeek = now.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() + mondayOffset);
        weekStart.setHours(0, 0, 0, 0);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);
        const weekExpenses = expenses.filter(exp => {
          const expDate = new Date(exp.date);
          return expDate >= weekStart && expDate <= weekEnd;
        });
        const weekTotal = weekExpenses.reduce((sum, exp) => sum + exp.amount, 0);

        // Calculate this month
        const monthTotal = expenses.reduce((sum, exp) => sum + exp.amount, 0);

        setStats({
          today: { income: 0, expense: todayTotal },
          week: { income: 0, expense: weekTotal },
          month: { income: 0, expense: monthTotal },
        });
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }, [user]);

  // Load stats when user is available
  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user, refreshKey, loadStats]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <DashboardLayout>
      {/* Sync indicator */}
      {isSyncing && (
        <div className="mb-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center gap-3">
          <div className="w-2 h-2 bg-gray-900 dark:bg-gray-100 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Syncing to GitHub... ({queueSize} items)
          </span>
        </div>
      )}

      {/* Hero Section with Quick Actions */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Here&apos;s what&apos;s happening with your finances today.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm chi tiêu</span>
            </button>
            <button
              onClick={() => router.push('/spending')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-lg font-medium hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Xem chi tiết</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Today Card */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div className="mb-3">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Hôm nay</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(stats.today.income - stats.today.expense)}
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Thu</span>
                </div>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {formatCurrency(stats.today.income)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  <span>Chi</span>
                </div>
                <span className="font-medium text-red-600 dark:text-red-400">
                  -{formatCurrency(stats.today.expense)}
                </span>
              </div>
            </div>
          </div>

          {/* Week Card */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div className="mb-3">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Tuần này</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(stats.week.income - stats.week.expense)}
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Thu</span>
                </div>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {formatCurrency(stats.week.income)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  <span>Chi</span>
                </div>
                <span className="font-medium text-red-600 dark:text-red-400">
                  -{formatCurrency(stats.week.expense)}
                </span>
              </div>
            </div>
          </div>

          {/* Month Card */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div className="mb-3">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Tháng này</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(stats.month.income - stats.month.expense)}
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Thu</span>
                </div>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {formatCurrency(stats.month.income)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  <span>Chi</span>
                </div>
                <span className="font-medium text-red-600 dark:text-red-400">
                  -{formatCurrency(stats.month.expense)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column - Main Content (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Spending Widget - Real data */}
          {user && <SpendingWidget key={refreshKey} userId={user.id} />}

          {/* Recent Transactions */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Tính năng khác
              </h3>
            </div>
            <div className="space-y-3">
              {/* Placeholder */}
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-gray-400 dark:text-gray-600" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Đang phát triển
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar (1/3 width) */}
        <div className="space-y-6">
          {/* Widget placeholder */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-5 opacity-60">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <svg className="w-4 h-4 text-gray-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Thống kê
                </h3>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                Đang phát triển
              </span>
            </div>
            <div className="mb-2">
              <p className="text-2xl font-bold text-gray-300 dark:text-gray-700">
                --/--
              </p>
            </div>
            <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gray-300 dark:bg-gray-700 rounded-full" style={{ width: '0%' }}></div>
            </div>
          </div>

          {/* Another widget placeholder */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-5 opacity-60">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Tính năng
              </h3>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                Đang phát triển
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">Placeholder</p>
                  <div className="h-1 bg-gray-100 dark:bg-gray-800 rounded-full mt-1">
                    <div className="h-full bg-gray-300 dark:bg-gray-700 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Truy cập nhanh
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => router.push('/spending')}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-4 h-4 text-gray-400 dark:text-gray-600 group-hover:text-gray-900 dark:group-hover:text-white" />
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                    Chi tiêu
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Placeholder */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Các tính năng khác
        </h2>
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-8 text-center opacity-60">
          <p className="text-gray-500 dark:text-gray-400">Đang phát triển</p>
        </div>
      </div>

      {/* Add Expense Modal */}
      {user && (
        <AddExpenseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userId={user.id}
          onSuccess={handleExpenseAdded}
        />
      )}
    </DashboardLayout>
  );
}
