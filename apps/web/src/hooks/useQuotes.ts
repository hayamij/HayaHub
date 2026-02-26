'use client';

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
  const {
    entities: quotes,
    isLoading,
    error,
    load: loadQuotes,
    create: createQuote,
    update: updateQuote,
    deleteEntity: deleteQuote,
  } = useEntityCRUD<QuoteDTO, CreateQuoteDTO, UpdateQuoteDTO>({
    getUseCase: container.getQuotesUseCase,
    createUseCase: container.createQuoteUseCase,
    updateUseCase: container.updateQuoteUseCase,
    deleteUseCase: container.deleteQuoteUseCase,
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
