'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { container } from '@/infrastructure/di/Container';
import type { ExpenseDTO } from 'hayahub-business';

interface UseExpensesOptions {
  userId: string;
  startDate?: Date;
  endDate?: Date;
  autoFetch?: boolean;
}

interface UseExpensesReturn {
  expenses: ExpenseDTO[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom Hook for Expense Management
 * Encapsulates all expense fetching logic to decouple UI from Business layer
 * 
 * Usage:
 * ```tsx
 * const { expenses, isLoading, error, refetch } = useExpenses({
 *   userId: user.id,
 *   startDate: new Date(2024, 0, 1),
 *   endDate: new Date(2024, 11, 31)
 * });
 * ```
 */
export function useExpenses({ 
  userId, 
  startDate, 
  endDate,
  autoFetch = true 
}: UseExpensesOptions): UseExpensesReturn {
  const [expenses, setExpenses] = useState<ExpenseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchExpenses = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const getExpensesUseCase = container.getExpensesUseCase;
      
      const result = await getExpensesUseCase.execute({
        userId,
        startDate,
        endDate,
      });

      if (result.isSuccess()) {
        setExpenses(result.value);
      } else {
        setError(result.error);
        setExpenses([]);
      }
    } catch (err) {
      setError(err as Error);
      setExpenses([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId, startDate, endDate]);

  useEffect(() => {
    if (autoFetch) {
      fetchExpenses();
    }
  }, [fetchExpenses, autoFetch]);

  return {
    expenses,
    isLoading,
    error,
    refetch: fetchExpenses,
  };
}

/**
 * Hook for current month expenses
 * Convenience wrapper around useExpenses with current month date range
 */
export function useMonthExpenses(userId: string, year?: number, month?: number): UseExpensesReturn {
  const now = new Date();
  const targetYear = year ?? now.getFullYear();
  const targetMonth = month ?? now.getMonth();

  const startDate = useMemo(() => new Date(targetYear, targetMonth, 1), [targetYear, targetMonth]);
  const endDate = useMemo(() => new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999), [targetYear, targetMonth]);

  return useExpenses({ userId, startDate, endDate });
}

/**
 * Hook for today's expenses
 */
export function useTodayExpenses(userId: string): UseExpensesReturn {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const date = today.getDate();

  const startOfDay = useMemo(() => new Date(year, month, date), [year, month, date]);
  const endOfDay = useMemo(() => new Date(year, month, date, 23, 59, 59, 999), [year, month, date]);

  return useExpenses({ userId, startDate: startOfDay, endDate: endOfDay });
}

/**
 * Hook for date range expenses
 */
export function useDateRangeExpenses(
  userId: string,
  startDate: Date,
  endDate: Date
): UseExpensesReturn {
  return useExpenses({ userId, startDate, endDate });
}
