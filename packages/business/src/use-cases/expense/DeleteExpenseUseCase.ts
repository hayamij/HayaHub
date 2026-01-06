import { success, failure, type Result } from 'hayahub-shared';
import type { IExpenseRepository } from '../../ports/IExpenseRepository';

export class DeleteExpenseUseCase {
  constructor(private readonly expenseRepository: IExpenseRepository) {}

  async execute(expenseId: string, userId: string): Promise<Result<void, Error>> {
    try {
      // Find expense
      const expense = await this.expenseRepository.findById(expenseId);
      if (!expense) {
        return failure(new Error('Expense not found'));
      }

      // Check ownership
      if (!expense.isOwnedBy(userId)) {
        return failure(new Error('Unauthorized'));
      }

      // Delete
      await this.expenseRepository.delete(expenseId);

      return success(undefined);
    } catch (error) {
      return failure(error as Error);
    }
  }
}
