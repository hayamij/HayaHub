'use client';

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
  const {
    entities: subscriptions,
    isLoading,
    error,
    load: loadSubscriptions,
    create: createSubscription,
    update: updateSubscription,
    deleteEntity: deleteSubscription,
  } = useEntityCRUD<SubscriptionDTO, CreateSubscriptionDTO, UpdateSubscriptionDTO>({
    getUseCase: container.getSubscriptionsUseCase,
    createUseCase: container.createSubscriptionUseCase,
    updateUseCase: container.updateSubscriptionUseCase,
    deleteUseCase: container.deleteSubscriptionUseCase,
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
