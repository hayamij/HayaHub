'use client';

import { useEffect, useState, useCallback } from 'react';
import { container } from '@/infrastructure/di/Container';
import type { SubscriptionDTO } from 'hayahub-business';
import { SubscriptionStatus } from 'hayahub-domain';

interface SubscriptionsWidgetStats {
  active: number;
  upcoming: number;
  monthlyTotal: number;
}

interface UseSubscriptionsWidgetReturn {
  upcomingSubscriptions: SubscriptionDTO[];
  stats: SubscriptionsWidgetStats;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom Hook for Subscriptions Widget
 * Encapsulates subscriptions data fetching and stats calculation
 */
export function useSubscriptionsWidget(userId: string | undefined): UseSubscriptionsWidgetReturn {
  const [upcomingSubscriptions, setUpcomingSubscriptions] = useState<SubscriptionDTO[]>([]);
  const [stats, setStats] = useState<SubscriptionsWidgetStats>({
    active: 0,
    upcoming: 0,
    monthlyTotal: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const calculateStats = useCallback((allSubscriptions: SubscriptionDTO[]) => {
    const activeSubscriptions = allSubscriptions.filter(
      (s) => s.status === SubscriptionStatus.ACTIVE
    );

    // Calculate upcoming renewals (within next 7 days)
    const now = new Date();
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const upcoming = activeSubscriptions
      .filter((s) => {
        const nextRenewal = new Date(s.nextBillingDate);
        return nextRenewal >= now && nextRenewal <= nextWeek;
      })
      .sort((a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime());

    // Calculate monthly total
    const monthlyTotal = activeSubscriptions.reduce((total, sub) => {
      // Convert all to monthly equivalent
      let monthlyAmount = sub.amount;
      if (sub.frequency === 'YEARLY') {
        monthlyAmount = sub.amount / 12;
      } else if (sub.frequency === 'WEEKLY') {
        monthlyAmount = sub.amount * 4.33; // Average weeks per month
      }
      return total + monthlyAmount;
    }, 0);

    setStats({
      active: activeSubscriptions.length,
      upcoming: upcoming.length,
      monthlyTotal: Math.round(monthlyTotal * 100) / 100,
    });

    setUpcomingSubscriptions(upcoming.slice(0, 5));
  }, []);

  const loadSubscriptions = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const getSubscriptionsUseCase = container.getSubscriptionsUseCase;
      const result = await getSubscriptionsUseCase.execute(userId);

      if (result.success) {
        const allSubscriptions = result.value;
        calculateStats(allSubscriptions);
      } else {
        setError(new Error('Failed to load subscriptions'));
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, calculateStats]);

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

  return {
    upcomingSubscriptions,
    stats,
    isLoading,
    error,
    refetch: loadSubscriptions,
  };
}
