'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, AlertCircle, TrendingUp, Calendar } from 'lucide-react';
import { Container } from '@/infrastructure/di/Container';
import { useAuth } from '@/contexts/AuthContext';
import type { SubscriptionDTO } from 'hayahub-business';

export default function SubscriptionsWidget() {
  const router = useRouter();
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
        const getSubscriptionsUseCase = Container.getSubscriptionsUseCase();
        const result = await getSubscriptionsUseCase.execute(user.id);

        if (result.success) {
          const allSubs = result.value;
          setSubscriptions(allSubs);

          const activeSubs = allSubs.filter((s) => s.status === 'ACTIVE');
          const monthlyCost = activeSubs.reduce((sum, s) => sum + s.amount, 0);

          // Calculate upcoming renewals (within next 7 days)
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
    .slice(0, 5);

  return (
    <div
      onClick={() => router.push('/subscriptions')}
      className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:scale-110 transition-transform">
            <CreditCard className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Đăng ký
          </h3>
        </div>
        <TrendingUp className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Đang dùng</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Chi/tháng</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                {formatCurrency(stats.monthlyCost).replace('₫', '')}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Sắp gia hạn</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.upcomingRenewals}</p>
            </div>
          </div>

          {/* Upcoming Renewals */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sắp gia hạn
            </p>
            {upcomingSubs.length > 0 ? (
              upcomingSubs.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-start gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors"
                >
                  <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {sub.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(sub.nextBillingDate).toLocaleDateString('vi-VN')}
                      </span>
                      <span>•</span>
                      <span className="font-medium">{formatCurrency(sub.amount)}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                Không có gia hạn sắp tới
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

