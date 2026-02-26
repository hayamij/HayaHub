'use client';

import { useEffect, useState, useCallback } from 'react';
import { container } from '@/infrastructure/di/Container';
import type { QuoteDTO } from 'hayahub-business';

interface QuotesWidgetStats {
  total: number;
  favorites: number;
}

interface UseQuotesWidgetReturn {
  dailyQuote: QuoteDTO | null;
  stats: QuotesWidgetStats;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom Hook for Quotes Widget
 * Encapsulates quotes data fetching and daily quote selection
 */
export function useQuotesWidget(userId: string | undefined): UseQuotesWidgetReturn {
  const [dailyQuote, setDailyQuote] = useState<QuoteDTO | null>(null);
  const [stats, setStats] = useState<QuotesWidgetStats>({
    total: 0,
    favorites: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadQuotes = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const getQuotesUseCase = container.getQuotesUseCase;
      const result = await getQuotesUseCase.execute(userId);

      if (result.success) {
        const allQuotes = result.value;
        const favorites = allQuotes.filter((q) => q.isFavorite);

        setStats({
          total: allQuotes.length,
          favorites: favorites.length,
        });

        // Get quote of the day (pseudo-random based on date)
        if (allQuotes.length > 0) {
          const today = new Date();
          const dayOfYear = Math.floor(
            (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
          );
          const index = dayOfYear % allQuotes.length;
          setDailyQuote(allQuotes[index]);
        }
      } else {
        setError(new Error('Failed to load quotes'));
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadQuotes();
  }, [loadQuotes]);

  return {
    dailyQuote,
    stats,
    isLoading,
    error,
    refetch: loadQuotes,
  };
}