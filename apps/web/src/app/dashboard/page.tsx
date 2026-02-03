'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageLoader } from '@/components/layout/PageLoader';
import { SpendingWidget } from '@/components/dashboard/SpendingWidget';
import CalendarWidget from '@/components/dashboard/CalendarWidget';
import ProjectsWidget from '@/components/dashboard/ProjectsWidget';
import WishlistWidget from '@/components/dashboard/WishlistWidget';
import QuoteWidget from '@/components/dashboard/QuoteWidget';
import SubscriptionsWidget from '@/components/dashboard/SubscriptionsWidget';
import { AddExpenseModal } from '@/components/dashboard/AddExpenseModal';
import { useAuth } from '@/contexts/AuthContext';
import { useSyncToast } from '@/hooks/useSyncToast';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { Plus, TrendingUp, FileText, ArrowUpRight, ArrowDownRight, Grid3x3, Layout } from 'lucide-react';
import { Container } from '@/infrastructure/di/Container';
import { getTodayRange, getWeekRange, getMonthRange, isDateInRange } from '@/lib/date-filter';
import { DashboardWorkspace } from '@/components/dashboard/DashboardWorkspace';
import type { DashboardWidgetDTO } from 'hayahub-business';
import type { LayoutPositionData } from 'hayahub-domain';

export default function DashboardPage() {
  const { user } = useAuth();
  useSyncToast(); // Auto show toast when syncing completes
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'workspace'>('grid');
  const [widgets, setWidgets] = useState<DashboardWidgetDTO[]>([]);
  const [isLoadingWidgets, setIsLoadingWidgets] = useState(false);
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

  const loadUserSettings = useCallback(async () => {
    if (!user?.id) return;

    try {
      const getUserSettingsUseCase = Container.getUserSettingsUseCase();
      const result = await getUserSettingsUseCase.execute({ userId: user.id });

      if (result.isSuccess()) {
        setViewMode(result.value.preferredDashboardView);
      }
    } catch (error) {
      console.error('Failed to load user settings:', error);
    }
  }, [user]);

  const saveViewMode = useCallback(async (mode: 'grid' | 'workspace') => {
    if (!user?.id) return;

    try {
      const updateUserSettingsUseCase = Container.updateUserSettingsUseCase();
      await updateUserSettingsUseCase.execute({
        userId: user.id,
        preferredDashboardView: mode,
      });
    } catch (error) {
      console.error('Failed to save view mode:', error);
    }
  }, [user]);

  const handleViewModeChange = (mode: 'grid' | 'workspace') => {
    setViewMode(mode);
    saveViewMode(mode);
  };

  const loadWidgets = useCallback(async () => {
    if (!user?.id) return;

    setIsLoadingWidgets(true);
    try {
      const getDashboardWidgetsUseCase = Container.getDashboardWidgetsUseCase();
      const result = await getDashboardWidgetsUseCase.execute(user.id);

      if (result.isSuccess()) {
        setWidgets(result.value);
      }
    } catch (error) {
      console.error('Failed to load widgets:', error);
    } finally {
      setIsLoadingWidgets(false);
    }
  }, [user]);

  const handleLayoutChange = async (id: string, layout: LayoutPositionData) => {
    if (!user?.id) return;

    try {
      const updateDashboardWidgetUseCase = Container.updateDashboardWidgetUseCase();
      const result = await updateDashboardWidgetUseCase.execute(id, {
        layoutPosition: layout,
      });

      if (result.isSuccess()) {
        setWidgets(prev => 
          prev.map(w => w.id === id ? { ...w, layoutPosition: layout } : w)
        );
      }
    } catch (error) {
      console.error('Failed to update widget layout:', error);
    }
  };

  const handleBatchLayoutChange = async (updates: Array<{ id: string; layout: LayoutPositionData }>) => {
    if (!user?.id) return;

    try {
      const updateManyDashboardWidgetsUseCase = Container.updateManyDashboardWidgetsUseCase();
      
      // Convert to WidgetUpdate format expected by use case
      const widgetUpdates = updates.map(update => ({
        id: update.id,
        updates: { layoutPosition: update.layout }
      }));

      const result = await updateManyDashboardWidgetsUseCase.execute(user.id, widgetUpdates);

      if (result.isSuccess()) {
        // Update state with all new layouts
        setWidgets(prev => 
          prev.map(widget => {
            const update = updates.find(u => u.id === widget.id);
            return update ? { ...widget, layoutPosition: update.layout } : widget;
          })
        );
      }
    } catch (error) {
      console.error('Failed to batch update widget layouts:', error);
    }
  };

  const handleToggleVisibility = async (id: string, visible: boolean) => {
    if (!user?.id) return;

    try {
      const updateDashboardWidgetUseCase = Container.updateDashboardWidgetUseCase();
      const result = await updateDashboardWidgetUseCase.execute(id, {
        isVisible: visible,
      });

      if (result.isSuccess()) {
        setWidgets(prev => 
          prev.map(w => w.id === id ? { ...w, isVisible: visible } : w)
        );
      }
    } catch (error) {
      console.error('Failed to toggle widget visibility:', error);
    }
  };


  const loadStats = useCallback(async () => {
    if (!user) return;

    try {
      const getExpensesUseCase = Container.getExpensesUseCase();
      const now = new Date();

      // Get all expenses for the month using shared utility
      const monthRange = getMonthRange();
      
      const result = await getExpensesUseCase.execute({
        userId: user.id,
        startDate: monthRange.start,
        endDate: monthRange.end,
      });

      if (result.isSuccess()) {
        const expenses = result.value;

        // Calculate today using shared utility
        const todayRange = getTodayRange();
        const todayExpenses = expenses.filter(exp => 
          isDateInRange(new Date(exp.date), todayRange.start, todayRange.end)
        );
        const todayTotal = todayExpenses.reduce((sum, exp) => sum + exp.amount, 0);

        // Calculate this week using shared utility
        const weekRange = getWeekRange(now);
        const weekExpenses = expenses.filter(exp => 
          isDateInRange(new Date(exp.date), weekRange.start, weekRange.end)
        );
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

  // Load stats, widgets and settings when user is available
  useEffect(() => {
    if (user) {
      loadStats();
      loadWidgets();
      loadUserSettings();
    }
  }, [user, loadStats, loadWidgets, loadUserSettings]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <PageLoader>
    <DashboardLayout>
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
            
            {/* View mode toggle */}
            <div className="inline-flex items-center gap-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-1">
              <button
                onClick={() => handleViewModeChange('grid')}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md font-medium transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
                title="Chế độ lưới"
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleViewModeChange('workspace')}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md font-medium transition-colors ${
                  viewMode === 'workspace'
                    ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
                title="Chế độ workspace"
              >
                <Layout className="w-4 h-4" />
              </button>
            </div>
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

      {/* Main Content */}
      {viewMode === 'grid' ? (
        /* Grid View - Two Column Layout */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Main Content (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Spending Widget - Real data */}
            {user && <SpendingWidget key={refreshKey} userId={user.id} />}

            {/* Calendar Widget */}
            <CalendarWidget />

            {/* Projects Widget */}
            <ProjectsWidget />
          </div>

          {/* Right Column - Sidebar (1/3 width) */}
          <div className="space-y-6">
            {/* Quote Widget */}
            <QuoteWidget />

            {/* Wishlist Widget */}
            <WishlistWidget />

            {/* Subscriptions Widget */}
            <SubscriptionsWidget />

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
      ) : (
        /* Workspace View - Drag & Drop */
        <div className="mb-8">
          {isLoadingWidgets ? (
            <div className="flex items-center justify-center h-96 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-gray-900 dark:border-gray-100 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-gray-500 dark:text-gray-400">Đang tải widgets...</p>
              </div>
            </div>
          ) : user ? (
            <DashboardWorkspace
              widgets={widgets}
              onLayoutChange={handleLayoutChange}
              onBatchLayoutChange={handleBatchLayoutChange}
              onToggleVisibility={handleToggleVisibility}
              userId={user.id}
            />
          ) : null}
        </div>
      )}

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
    </PageLoader>
  );
}
