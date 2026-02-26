'use client';

import { useMemo } from 'react';
import { container } from '@/infrastructure/di/Container';
import type { ExpenseDTO, GetExpensesQuery } from 'hayahub-business';
import { useEntityCRUD } from './useEntityCRUD';

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
 * Custom Hook for Expense Management (Read-only)
 * Uses generic useEntityCRUD to eliminate code duplication
 * Supports date range filtering for expense queries
 * 
 * Note: For create/update/delete operations with ownership checks,
 * use useExpenseData or useExpenseActions hooks instead.
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
  // Extract timestamps BEFORE useMemo to ensure stable primitive comparisons
  const startTime = startDate?.getTime();
  const endTime = endDate?.getTime();
  
  // Create query params with stable reference based on primitive timestamps
  const queryParams: GetExpensesQuery = useMemo(() => ({
    userId,
    startDate,
    endDate,
  }), [userId, startTime, endTime]);

  const {
    entities: expenses,
    isLoading,
    error,
    load: refetch,
  } = useEntityCRUD<ExpenseDTO, never, never, GetExpensesQuery>({
    getUseCase: container.getExpensesUseCase,
    // Note: create/update/delete not provided here due to ownership checks
    // Use useExpenseActions or useExpenseData for these operations
    getParams: queryParams,
    autoLoad: autoFetch,
  });

  return {
    expenses,
    isLoading,
    error,
    refetch,
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
  // Memoize dates to prevent infinite loops from parent component re-renders
  const memoizedStartDate = useMemo(() => startDate, [startDate.getTime()]);
  const memoizedEndDate = useMemo(() => endDate, [endDate.getTime()]);
  
  return useExpenses({ userId, startDate: memoizedStartDate, endDate: memoizedEndDate });
}
