'use client';

import { useMemo } from 'react';
import { container } from '@/infrastructure/di/Container';
import type { SubscriptionDTO, CreateSubscriptionDTO, UpdateSubscriptionDTO } from 'hayahub-business';
import { useEntityCRUD } from './useEntityCRUD';

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
 * Uses generic useEntityCRUD to eliminate code duplication
 */
export function useSubscriptions(userId: string | undefined): UseSubscriptionsReturn {
  // Memoize use cases to prevent getter re-evaluation
  const getSubscriptionsUseCase = useMemo(() => container.getSubscriptionsUseCase, []);
  const createSubscriptionUseCase = useMemo(() => container.createSubscriptionUseCase, []);
  const updateSubscriptionUseCase = useMemo(() => container.updateSubscriptionUseCase, []);
  const deleteSubscriptionUseCase = useMemo(() => container.deleteSubscriptionUseCase, []);
  
  const {
    entities: subscriptions,
    isLoading,
    error,
    load: loadSubscriptions,
    create: createSubscription,
    update: updateSubscription,
    deleteEntity: deleteSubscription,
  } = useEntityCRUD<SubscriptionDTO, CreateSubscriptionDTO, UpdateSubscriptionDTO>({
    getUseCase: getSubscriptionsUseCase,
    createUseCase: createSubscriptionUseCase,
    updateUseCase: updateSubscriptionUseCase,
    deleteUseCase: deleteSubscriptionUseCase,
    getParams: userId!,
  });

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
