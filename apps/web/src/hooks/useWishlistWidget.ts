'use client';

import { useEffect, useState, useCallback } from 'react';
import { container } from '@/infrastructure/di/Container';
import type { WishItemDTO } from 'hayahub-business';

interface WishlistWidgetStats {
  total: number;
  highPriority: number;
  totalValue: number;
}

interface UseWishlistWidgetReturn {
  topWishItems: WishItemDTO[];
  stats: WishlistWidgetStats;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom Hook for Wishlist Widget
 * Encapsulates wishlist data fetching and stats calculation
 */
export function useWishlistWidget(userId: string | undefined): UseWishlistWidgetReturn {
  const [topWishItems, setTopWishItems] = useState<WishItemDTO[]>([]);
  const [stats, setStats] = useState<WishlistWidgetStats>({
    total: 0,
    highPriority: 0,
    totalValue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const calculateStats = useCallback((allItems: WishItemDTO[]) => {
    // Priority: 1 = URGENT, 2 = HIGH, 3 = MEDIUM, 4 = LOW, 5 = VERY_LOW
    const highPriority = allItems.filter((item) => item.priority <= 2);

    const totalValue = allItems.reduce((sum, item) => {
      return sum + (item.estimatedPrice || 0);
    }, 0);

    // Get top priority items (sort by priority ascending, lower number = higher priority)
    const topItems = [...allItems]
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 5);

    setStats({
      total: allItems.length,
      highPriority: highPriority.length,
      totalValue: Math.round(totalValue * 100) / 100,
    });

    setTopWishItems(topItems);
  }, []);

  const loadWishItems = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const getWishItemsUseCase = container.getWishItemsUseCase;
      const result = await getWishItemsUseCase.execute(userId);

      if (result.success) {
        const allItems = result.value;
        calculateStats(allItems);
      } else {
        setError(new Error('Failed to load wishlist'));
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, calculateStats]);

  useEffect(() => {
    loadWishItems();
  }, [loadWishItems]);

  return {
    topWishItems,
    stats,
    isLoading,
    error,
    refetch: loadWishItems,
  };
}
