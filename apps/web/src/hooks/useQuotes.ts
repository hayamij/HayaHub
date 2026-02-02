'use client';

import { useState, useCallback, useEffect } from 'react';
import { Container } from '@/infrastructure/di/Container';
import type { QuoteDTO, CreateQuoteDTO, UpdateQuoteDTO } from 'hayahub-business';

interface UseQuotesReturn {
  quotes: QuoteDTO[];
  isLoading: boolean;
  error: Error | null;
  loadQuotes: () => Promise<void>;
  createQuote: (dto: CreateQuoteDTO) => Promise<boolean>;
  updateQuote: (id: string, dto: UpdateQuoteDTO) => Promise<boolean>;
  deleteQuote: (id: string) => Promise<boolean>;
}

/**
 * Custom Hook for Quote Management
 */
export function useQuotes(userId: string | undefined): UseQuotesReturn {
  const [quotes, setQuotes] = useState<QuoteDTO[]>([]);
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
      const getQuotesUseCase = Container.getQuotesUseCase();
      const result = await getQuotesUseCase.execute(userId);

      if (result.isSuccess()) {
        setQuotes(result.value);
      } else {
        setError(result.error);
        setQuotes([]);
      }
    } catch (err) {
      setError(err as Error);
      setQuotes([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const createQuote = useCallback(
    async (dto: CreateQuoteDTO): Promise<boolean> => {
      try {
        const createQuoteUseCase = Container.createQuoteUseCase();
        const result = await createQuoteUseCase.execute(dto);

        if (result.isSuccess()) {
          await loadQuotes();
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
    [loadQuotes]
  );

  const updateQuote = useCallback(
    async (id: string, dto: UpdateQuoteDTO): Promise<boolean> => {
      try {
        const updateQuoteUseCase = Container.updateQuoteUseCase();
        const result = await updateQuoteUseCase.execute(id, dto);

        if (result.isSuccess()) {
          await loadQuotes();
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
    [loadQuotes]
  );

  const deleteQuote = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const deleteQuoteUseCase = Container.deleteQuoteUseCase();
        const result = await deleteQuoteUseCase.execute(id);

        if (result.isSuccess()) {
          await loadQuotes();
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
    [loadQuotes]
  );

  useEffect(() => {
    loadQuotes();
  }, [loadQuotes]);

  return {
    quotes,
    isLoading,
    error,
    loadQuotes,
    createQuote,
    updateQuote,
    deleteQuote,
  };
}
