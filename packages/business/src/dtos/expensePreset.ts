import type { ExpenseCategory } from 'hayahub-domain';

/**
 * DTO for creating a new expense preset
 */
export interface CreateExpensePresetDTO {
  userId: string;
  name: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  notes?: string;
}

/**
 * DTO for updating an existing expense preset
 */
export interface UpdateExpensePresetDTO {
  id: string;
  name?: string;
  amount?: number;
  currency?: string;
  category?: ExpenseCategory;
  notes?: string;
}

/**
 * DTO for expense preset response
 */
export interface ExpensePresetDTO {
  id: string;
  userId: string;
  name: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}
