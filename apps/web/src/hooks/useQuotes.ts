'use client';

import { useMemo } from 'react';
import { container } from '@/infrastructure/di/Container';
import type { QuoteDTO, CreateQuoteDTO, UpdateQuoteDTO } from 'hayahub-business';
import { useEntityCRUD } from './useEntityCRUD';

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
 * Uses generic useEntityCRUD to eliminate code duplication
 */
export function useQuotes(userId: string | undefined): UseQuotesReturn {
  // Memoize use cases to prevent getter re-evaluation
  const getQuotesUseCase = useMemo(() => container.getQuotesUseCase, []);
  const createQuoteUseCase = useMemo(() => container.createQuoteUseCase, []);
  const updateQuoteUseCase = useMemo(() => container.updateQuoteUseCase, []);
  const deleteQuoteUseCase = useMemo(() => container.deleteQuoteUseCase, []);
  
  const {
    entities: quotes,
    isLoading,
    error,
    load: loadQuotes,
    create: createQuote,
    update: updateQuote,
    deleteEntity: deleteQuote,
  } = useEntityCRUD<QuoteDTO, CreateQuoteDTO, UpdateQuoteDTO>({
    getUseCase: getQuotesUseCase,
    createUseCase: createQuoteUseCase,
    updateUseCase: updateQuoteUseCase,
    deleteUseCase: deleteQuoteUseCase,
    getParams: userId!,
  });

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
