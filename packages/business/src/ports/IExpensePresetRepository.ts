import type { ExpensePreset, ExpenseCategory } from 'hayahub-domain';

/**
 * Port (Interface) for ExpensePreset Repository
 * Infrastructure layer will implement this
 */
export interface IExpensePresetRepository {
  save(preset: ExpensePreset): Promise<void>;
  findById(id: string): Promise<ExpensePreset | null>;
  findByUserId(userId: string): Promise<ExpensePreset[]>;
  findByUserIdAndCategory(userId: string, category: ExpenseCategory): Promise<ExpensePreset[]>;
  update(preset: ExpensePreset): Promise<void>;
  delete(id: string): Promise<void>;
  findAll(): Promise<ExpensePreset[]>;
}
