import { useState, useCallback } from 'react';
import { ExpenseCategory } from 'hayahub-domain';
import type { ExpenseDTO } from 'hayahub-business';
import { container } from '@/infrastructure/di/Container';

export interface ExpenseRow {
  id: string;
  date: Date;
  description: string;
  amount: number;
  category: ExpenseCategory;
  notes: string;
}

export function useExpenseData(userId: string | undefined) {
  const [expenses, setExpenses] = useState<ExpenseRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadExpenses = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const getExpensesUseCase = container.getExpensesUseCase;

      // Load expenses from the last 3 years for year comparison
      const currentYear = new Date().getFullYear();
      const startDate = new Date(currentYear - 2, 0, 1, 0, 0, 0, 0);
      const endDate = new Date(currentYear, 11, 31, 23, 59, 59, 999);

      const result = await getExpensesUseCase.execute({
        userId,
        startDate,
        endDate,
      });

      if (result.isSuccess()) {
        const expenseRows: ExpenseRow[] = result.value.map((exp: ExpenseDTO) => ({
          id: exp.id,
          date: new Date(exp.date),
          description: exp.description,
          amount: exp.amount,
          category: exp.category,
          notes: exp.tags.join(', '),
        }));
        setExpenses(expenseRows);
      }
    } catch (error) {
      console.error('Failed to load expenses:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const updateExpense = useCallback(async (
    expenseId: string,
    data: {
      description: string;
      amount: number;
      currency: string;
      category: ExpenseCategory;
      date: Date;
      tags: string[];
    }
  ): Promise<boolean> => {
    if (!userId) return false;

    try {
      const updateExpenseUseCase = container.updateExpenseUseCase;
      const result = await updateExpenseUseCase.execute(expenseId, userId, data);

      if (result.isSuccess()) {
        await loadExpenses();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update expense:', error);
      return false;
    }
  }, [userId, loadExpenses]);

  const deleteExpense = useCallback(async (expenseId: string): Promise<boolean> => {
    if (!userId) return false;

    try {
      const deleteExpenseUseCase = container.deleteExpenseUseCase;
      const result = await deleteExpenseUseCase.execute(expenseId, userId);

      if (result.isSuccess()) {
        await loadExpenses();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete expense:', error);
      return false;
    }
  }, [userId, loadExpenses]);

  return {
    expenses,
    isLoading,
    loadExpenses,
    updateExpense,
    deleteExpense,
  };
}
