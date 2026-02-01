'use client';

import { SubscriptionDTO } from 'hayahub-business';
import { SubscriptionFrequency, SubscriptionStatus } from 'hayahub-domain';
import { DollarSign, Activity, Calendar } from 'lucide-react';

interface SubscriptionStatsCardsProps {
  subscriptions: SubscriptionDTO[];
  formatCurrency: (amount: number, currency: string) => string;
}

function toMonthlyEquivalent(amount: number, frequency: SubscriptionFrequency): number {
  switch (frequency) {
    case SubscriptionFrequency.DAILY:
      return amount * 30;
    case SubscriptionFrequency.WEEKLY:
      return amount * 4.33;
    case SubscriptionFrequency.MONTHLY:
      return amount;
    case SubscriptionFrequency.YEARLY:
      return amount / 12;
    default:
      return amount;
  }
}

export function SubscriptionStatsCards({ subscriptions, formatCurrency }: SubscriptionStatsCardsProps) {
  const activeSubscriptions = subscriptions.filter((s) => s.status === SubscriptionStatus.ACTIVE);

  // Calculate total monthly cost (convert all to monthly equivalent)
  const totalMonthlyCost = activeSubscriptions.reduce((sum, sub) => {
    return sum + toMonthlyEquivalent(sub.amount, sub.frequency);
  }, 0);

  // Count upcoming this month
  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const upcomingThisMonth = activeSubscriptions.filter((sub) => {
    const nextBilling = new Date(sub.nextBillingDate);
    return nextBilling >= now && nextBilling <= endOfMonth;
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Monthly Cost Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng chi phí/tháng</h3>
          <DollarSign className="w-5 h-5 text-blue-500" />
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatCurrency(totalMonthlyCost, 'VND')}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          Từ {activeSubscriptions.length} subscription đang hoạt động
        </p>
      </div>

      {/* Active Subscriptions Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Đang hoạt động</h3>
          <Activity className="w-5 h-5 text-green-500" />
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {activeSubscriptions.length}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {subscriptions.length - activeSubscriptions.length} tạm dừng/hủy
        </p>
      </div>

      {/* Upcoming This Month Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Sắp thanh toán</h3>
          <Calendar className="w-5 h-5 text-orange-500" />
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {upcomingThisMonth}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          Trong tháng này
        </p>
      </div>
    </div>
  );
}
