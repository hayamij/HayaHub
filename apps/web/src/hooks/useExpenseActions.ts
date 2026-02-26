import { useState } from 'react';
import { Container } from '@/infrastructure/di/Container';
import type { CreateExpenseDTO } from 'hayahub-business';

interface UseExpenseActionsReturn {
  createExpense: (dto: CreateExpenseDTO) => Promise<{ success: boolean; error?: string }>;
  isCreating: boolean;
  error: string | null;
}

export function useExpenseActions(): UseExpenseActionsReturn {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const container = Container.getInstance();
  const createExpenseUseCase = container.createExpenseUseCase;

  const createExpense = async (dto: CreateExpenseDTO) => {
    setIsCreating(true);
    setError(null);

    try {
      const result = await createExpenseUseCase.execute(dto);

      if (result.isSuccess()) {
        return { success: true };
      } else {
        const errorMessage = result.error.message;
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create expense';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createExpense,
    isCreating,
    error,
  };
}
