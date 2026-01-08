'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SpendingWidget } from '@/components/dashboard/SpendingWidget';
import { useAuth } from '@/contexts/AuthContext';
import { useSyncStatus } from '@/hooks/useSyncStatus';
import { useRouter } from 'next/navigation';
import { Plus, TrendingUp, FileText, Target, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { isSyncing, queueSize } = useSyncStatus();
  const router = useRouter();

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
              onClick={() => router.push('/spending')}
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
              <span>Xem báo cáo</span>
            </button>
            <button
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-lg font-medium hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Đồng bộ</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Hôm nay</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">--</p>
              </div>
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <TrendingUp className="w-5 h-5 text-gray-900 dark:text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tuần này</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">--</p>
              </div>
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <TrendingUp className="w-5 h-5 text-gray-900 dark:text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tháng này</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">--</p>
              </div>
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <TrendingUp className="w-5 h-5 text-gray-900 dark:text-white" />
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
          {user && <SpendingWidget userId={user.id} />}

          {/* Recent Transactions */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Giao dịch gần đây
              </h3>
              <button
                onClick={() => router.push('/spending')}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Xem tất cả →
              </button>
            </div>
            <div className="space-y-3">
              {/* Empty state */}
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-gray-400 dark:text-gray-600" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Chưa có giao dịch nào
                </p>
                <button
                  onClick={() => router.push('/spending')}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" />
                  Thêm chi tiêu đầu tiên
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar (1/3 width) */}
        <div className="space-y-6">
          {/* Budget Widget - Coming Soon */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-5 opacity-60">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <svg className="w-4 h-4 text-gray-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Ngân sách
                </h3>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                Sắp có
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

          {/* Savings Goals - Coming Soon */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-5 opacity-60">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Mục tiêu tiết kiệm
              </h3>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                Sắp có
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">Du lịch 2026</p>
                  <div className="h-1 bg-gray-100 dark:bg-gray-800 rounded-full mt-1">
                    <div className="h-full bg-gray-300 dark:bg-gray-700 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">Quỹ khẩn cấp</p>
                  <div className="h-1 bg-gray-100 dark:bg-gray-800 rounded-full mt-1">
                    <div className="h-full bg-gray-300 dark:bg-gray-700 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar & Todo - Coming Soon */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-5 opacity-60">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <svg className="w-4 h-4 text-gray-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Lịch & Todo
                </h3>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                Sắp có
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-600">
                <div className="w-2 h-2 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                <span>-- sự kiện hôm nay</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-600">
                <div className="w-2 h-2 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                <span>-- việc cần làm</span>
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
              <button
                onClick={() => router.push('/profile')}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group opacity-60"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-gray-400 dark:text-gray-600" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Báo cáo
                  </span>
                  <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
                    Sắp có
                  </span>
                </div>
              </button>
              <button
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group opacity-60"
              >
                <div className="flex items-center gap-3">
                  <Target className="w-4 h-4 text-gray-400 dark:text-gray-600" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Mục tiêu
                  </span>
                  <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
                    Sắp có
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - More Features Coming Soon */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Sắp ra mắt
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Income - Coming Soon */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4 opacity-60">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <svg className="w-5 h-5 text-gray-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Thu nhập
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-600">
                  Quản lý nguồn thu
                </p>
              </div>
            </div>
          </div>

          {/* Wishlist - Coming Soon */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4 opacity-60">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <svg className="w-5 h-5 text-gray-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Wishlist
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-600">
                  Danh sách mong muốn
                </p>
              </div>
            </div>
          </div>

          {/* Plans - Coming Soon */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4 opacity-60">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <svg className="w-5 h-5 text-gray-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Kế hoạch
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-600">
                  Lập kế hoạch chi tiêu
                </p>
              </div>
            </div>
          </div>

          {/* Subscriptions - Coming Soon */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4 opacity-60">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <svg className="w-5 h-5 text-gray-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Subscription
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-600">
                  Dịch vụ định kỳ
                </p>
              </div>
            </div>
          </div>

          {/* Bills - Coming Soon */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4 opacity-60">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <svg className="w-5 h-5 text-gray-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Hóa đơn
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-600">
                  Thanh toán một lần
                </p>
              </div>
            </div>
          </div>

          {/* Quotes - Coming Soon */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4 opacity-60">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <svg className="w-5 h-5 text-gray-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Quotes
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-600">
                  Trích dẫn truyền cảm hứng
                </p>
              </div>
            </div>
          </div>

          {/* Analytics - Coming Soon */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4 opacity-60">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <svg className="w-5 h-5 text-gray-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phân tích
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-600">
                  Báo cáo & Thống kê
                </p>
              </div>
            </div>
          </div>

          {/* Notes - Coming Soon */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4 opacity-60">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <svg className="w-5 h-5 text-gray-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ghi chú
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-600">
                  Ghi chú tài chính
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
