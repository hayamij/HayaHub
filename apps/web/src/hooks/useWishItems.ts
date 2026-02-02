'use client';

import { useState, useCallback, useEffect } from 'react';
import { Container } from '@/infrastructure/di/Container';
import type { WishItemDTO, CreateWishItemDTO, UpdateWishItemDTO } from 'hayahub-business';

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
 */
export function useWishItems(userId: string | undefined): UseWishItemsReturn {
  const [wishItems, setWishItems] = useState<WishItemDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadWishItems = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const getWishItemsUseCase = Container.getWishItemsUseCase();
      const result = await getWishItemsUseCase.execute(userId);

      if (result.isSuccess()) {
        setWishItems(result.value);
      } else {
        setError(result.error);
        setWishItems([]);
      }
    } catch (err) {
      setError(err as Error);
      setWishItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const createWishItem = useCallback(
    async (dto: CreateWishItemDTO): Promise<boolean> => {
      try {
        const createWishItemUseCase = Container.createWishItemUseCase();
        const result = await createWishItemUseCase.execute(dto);

        if (result.isSuccess()) {
          await loadWishItems();
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
    [loadWishItems]
  );

  const updateWishItem = useCallback(
    async (id: string, dto: UpdateWishItemDTO): Promise<boolean> => {
      try {
        const updateWishItemUseCase = Container.updateWishItemUseCase();
        const result = await updateWishItemUseCase.execute(id, dto);

        if (result.isSuccess()) {
          await loadWishItems();
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
    [loadWishItems]
  );

  const deleteWishItem = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const deleteWishItemUseCase = Container.deleteWishItemUseCase();
        const result = await deleteWishItemUseCase.execute(id);

        if (result.isSuccess()) {
          await loadWishItems();
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
    [loadWishItems]
  );

  useEffect(() => {
    loadWishItems();
  }, [loadWishItems]);

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
