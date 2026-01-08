'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useSyncStatus } from '@/hooks/useSyncStatus';
import {
  TrendingUp,
  Wallet,
  Calendar,
  Target,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { isSyncing, queueSize } = useSyncStatus();

  // Mock data - sẽ được thay thế bằng data thật sau
  const stats = [
    {
      id: 'total-expenses',
      label: 'Total Expenses',
      value: '$2,450.00',
      change: '+12.5%',
      icon: TrendingUp,
      color: 'text-gray-900 dark:text-gray-100',
      bgColor: 'bg-gray-100 dark:bg-gray-800',
    },
    {
      id: 'monthly-budget',
      label: 'Monthly Budget',
      value: '$5,000.00',
      change: '49% used',
      icon: Wallet,
      color: 'text-gray-900 dark:text-gray-100',
      bgColor: 'bg-gray-100 dark:bg-gray-800',
    },
    {
      id: 'this-month',
      label: 'This Month',
      value: '$1,234.00',
      change: '-8.3%',
      icon: Calendar,
      color: 'text-gray-900 dark:text-gray-100',
      bgColor: 'bg-gray-100 dark:bg-gray-800',
    },
    {
      id: 'savings-goal',
      label: 'Savings Goal',
      value: '78%',
      change: '+5% this week',
      icon: Target,
      color: 'text-gray-900 dark:text-gray-100',
      bgColor: 'bg-gray-100 dark:bg-gray-800',
    },
  ];

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

      {/* Welcome section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Here's what's happening with your finances today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {stat.label}
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {stat.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-gray-900 dark:hover:border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
            <p className="font-medium text-gray-900 dark:text-white">Add Expense</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Track a new expense
            </p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-gray-900 dark:hover:border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
            <p className="font-medium text-gray-900 dark:text-white">View Reports</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Analyze your spending
            </p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-gray-900 dark:hover:border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
            <p className="font-medium text-gray-900 dark:text-white">Set Budget</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage your budget
            </p>
          </button>
        </div>
      </div>

      {/* Recent activity placeholder */}
      <div className="mt-8 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h2>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No recent activity yet. Start by adding your first expense!
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
