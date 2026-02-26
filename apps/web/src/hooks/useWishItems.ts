'use client';

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
  const {
    entities: wishItems,
    isLoading,
    error,
    load: loadWishItems,
    create: createWishItem,
    update: updateWishItem,
    deleteEntity: deleteWishItem,
  } = useEntityCRUD<WishItemDTO, CreateWishItemDTO, UpdateWishItemDTO>({
    getUseCase: container.getWishItemsUseCase,
    createUseCase: container.createWishItemUseCase,
    updateUseCase: container.updateWishItemUseCase,
    deleteUseCase: container.deleteWishItemUseCase,
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
