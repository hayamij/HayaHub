import type { Expense } from 'hayahub-domain';

/**
 * Port (Interface) for Expense Repository
 * Infrastructure layer will implement this
 */
export interface IExpenseRepository {
  save(expense: Expense): Promise<void>;
  findById(id: string): Promise<Expense | null>;
  findByUserId(userId: string): Promise<Expense[]>;
  findByUserIdAndDateRange(userId: string, startDate: Date, endDate: Date): Promise<Expense[]>;
  update(expense: Expense): Promise<void>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Expense[]>;
}
