'use client';

import { useMemo } from 'react';
import { container } from '@/infrastructure/di/Container';
import type { WishItemDTO, CreateWishItemDTO, UpdateWishItemDTO } from 'hayahub-business';
import { useEntityCRUD } from './useEntityCRUD';

interface UseWishItemsReturn {
  wishItems: WishItemDTO[];
  isLoading: boolean;
  error: Error | null;
  loadWishItems: () => Promise<void>;
  createWishItem: (dto: CreateWishItemDTO) => Promise<boolean>;
  updateWishItem: (id: string, dto: UpdateWishItemDTO) => Promise<boolean>;
  deleteWishItem: (id: string) => Promise<boolean>;
}

/**
 * Custom Hook for WishItem Management
 * Uses generic useEntityCRUD to eliminate code duplication
 */
export function useWishItems(userId: string | undefined): UseWishItemsReturn {
  // Memoize use cases to prevent getter re-evaluation
  const getWishItemsUseCase = useMemo(() => container.getWishItemsUseCase, []);
  const createWishItemUseCase = useMemo(() => container.createWishItemUseCase, []);
  const updateWishItemUseCase = useMemo(() => container.updateWishItemUseCase, []);
  const deleteWishItemUseCase = useMemo(() => container.deleteWishItemUseCase, []);
  
  const {
    entities: wishItems,
    isLoading,
    error,
    load: loadWishItems,
    create: createWishItem,
    update: updateWishItem,
    deleteEntity: deleteWishItem,
  } = useEntityCRUD<WishItemDTO, CreateWishItemDTO, UpdateWishItemDTO>({
    getUseCase: getWishItemsUseCase,
    createUseCase: createWishItemUseCase,
    updateUseCase: updateWishItemUseCase,
    deleteUseCase: deleteWishItemUseCase,
    getParams: userId!,
  });

  return {
    wishItems,
    isLoading,
    error,
    loadWishItems,
    createWishItem,
    updateWishItem,
    deleteWishItem,
  };
}
