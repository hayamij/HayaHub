import type { ExpenseCategory } from 'hayahub-domain';

export interface CreateExpenseDTO {
  userId: string;
  description: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  date: Date;
  tags?: string[];
}

export interface UpdateExpenseDTO {
  description?: string;
  amount?: number;
  currency?: string;
  category?: ExpenseCategory;
  date?: Date;
  tags?: string[];
}

export interface ExpenseDTO {
  id: string;
  userId: string;
  description: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  date: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ExpenseSummaryDTO {
  totalAmount: number;
  currency: string;
  count: number;
  byCategory: Record<ExpenseCategory, number>;
}
