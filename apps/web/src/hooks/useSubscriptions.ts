'use client';

import { useState, useCallback, useEffect } from 'react';
import { Container } from '@/infrastructure/di/Container';
import type { SubscriptionDTO, CreateSubscriptionDTO, UpdateSubscriptionDTO } from 'hayahub-business';

interface UseSubscriptionsReturn {
  subscriptions: SubscriptionDTO[];
  isLoading: boolean;
  error: Error | null;
  loadSubscriptions: () => Promise<void>;
  createSubscription: (dto: CreateSubscriptionDTO) => Promise<boolean>;
  updateSubscription: (id: string, dto: UpdateSubscriptionDTO) => Promise<boolean>;
  deleteSubscription: (id: string) => Promise<boolean>;
}

/**
 * Custom Hook for Subscription Management
 * Following the pattern from useExpenseData.ts
 */
export function useSubscriptions(userId: string | undefined): UseSubscriptionsReturn {
  const [subscriptions, setSubscriptions] = useState<SubscriptionDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadSubscriptions = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const getSubscriptionsUseCase = Container.getSubscriptionsUseCase();
      const result = await getSubscriptionsUseCase.execute(userId);

      if (result.isSuccess()) {
        setSubscriptions(result.value);
      } else {
        setError(result.error);
        setSubscriptions([]);
      }
    } catch (err) {
      setError(err as Error);
      setSubscriptions([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const createSubscription = useCallback(
    async (dto: CreateSubscriptionDTO): Promise<boolean> => {
      try {
        const createSubscriptionUseCase = Container.createSubscriptionUseCase();
        const result = await createSubscriptionUseCase.execute(dto);

        if (result.isSuccess()) {
          await loadSubscriptions();
          return true;
        } else {
          setError(result.error);
          return false;
        }
      } catch (err) {
        setError(err as Error);
        return false;
      }
    },
    [loadSubscriptions]
  );

  const updateSubscription = useCallback(
    async (id: string, dto: UpdateSubscriptionDTO): Promise<boolean> => {
      try {
        const updateSubscriptionUseCase = Container.updateSubscriptionUseCase();
        const result = await updateSubscriptionUseCase.execute(id, dto);

        if (result.isSuccess()) {
          await loadSubscriptions();
          return true;
        } else {
          setError(result.error);
          return false;
        }
      } catch (err) {
        setError(err as Error);
        return false;
      }
    },
    [loadSubscriptions]
  );

  const deleteSubscription = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const deleteSubscriptionUseCase = Container.deleteSubscriptionUseCase();
        const result = await deleteSubscriptionUseCase.execute(id);

        if (result.isSuccess()) {
          await loadSubscriptions();
          return true;
        } else {
          setError(result.error);
          return false;
        }
      } catch (err) {
        setError(err as Error);
        return false;
      }
    },
    [loadSubscriptions]
  );

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

  return {
    subscriptions,
    isLoading,
    error,
    loadSubscriptions,
    createSubscription,
    updateSubscription,
    deleteSubscription,
  };
}
