'use client';

import { useEffect, useState } from 'react';
import { CreditCard, Calendar } from 'lucide-react';
import { container } from '@/infrastructure/di/Container';
import { useAuth } from '@/contexts/AuthContext';
import type { SubscriptionDTO } from 'hayahub-business';

export default function SubscriptionsWidgetContent() {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<SubscriptionDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    active: 0,
    monthlyCost: 0,
    upcomingRenewals: 0,
  });

  useEffect(() => {
    const loadSubscriptions = async () => {
      if (!user?.id) return;

      setIsLoading(true);
      try {
        const getSubscriptionsUseCase = container.getSubscriptionsUseCase;
        const result = await getSubscriptionsUseCase.execute(user.id);

        if (result.success) {
          const allSubs = result.value;
          setSubscriptions(allSubs);

          const activeSubs = allSubs.filter((s) => s.status === 'ACTIVE');
          const monthlyCost = activeSubs.reduce((sum, s) => sum + s.amount, 0);

          const now = new Date();
          const nextWeek = new Date(now);
          nextWeek.setDate(nextWeek.getDate() + 7);

          const upcomingRenewals = activeSubs.filter((s) => {
            const nextBilling = new Date(s.nextBillingDate);
            return nextBilling >= now && nextBilling <= nextWeek;
          });

          setStats({
            active: activeSubs.length,
            monthlyCost,
            upcomingRenewals: upcomingRenewals.length,
          });
        }
      } catch (error) {
        console.error('Failed to load subscriptions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSubscriptions();
  }, [user]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-400">Đang tải...</div>
      </div>
    );
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const upcomingSubs = subscriptions
    .filter((s) => {
      const now = new Date();
      const nextWeek = new Date(now);
      nextWeek.setDate(nextWeek.getDate() + 7);
      const nextBilling = new Date(s.nextBillingDate);
      return s.status === 'ACTIVE' && nextBilling >= now && nextBilling <= nextWeek;
    })
    .sort((a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime())
    .slice(0, 4);

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
          <div className="text-xs text-green-600 dark:text-green-400 mb-1">Đang hoạt động</div>
          <div className="text-xl font-bold text-green-700 dark:text-green-300">{stats.active}</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
          <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">Chi phí/tháng</div>
          <div className="text-sm font-bold text-blue-700 dark:text-blue-300">
            {(stats.monthlyCost / 1000000).toFixed(1)}M
          </div>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg">
          <div className="text-xs text-orange-600 dark:text-orange-400 mb-1">Sắp gia hạn</div>
          <div className="text-xl font-bold text-orange-700 dark:text-orange-300">{stats.upcomingRenewals}</div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Sắp đến hạn (7 ngày)</h4>
        {upcomingSubs.length === 0 ? (
          <div className="text-sm text-gray-400 dark:text-gray-500">Không có đăng ký nào</div>
        ) : (
          <div className="space-y-2">
            {upcomingSubs.map((sub) => (
              <div
                key={sub.id}
                className="p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start gap-2">
                  <CreditCard className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{sub.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatCurrency(sub.amount)}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
                        <Calendar className="w-3 h-3" />
                        {new Date(sub.nextBillingDate).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
