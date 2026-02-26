import { Money } from 'hayahub-domain';
import { success, failure, type Result } from 'hayahub-shared';
import type { IExpenseRepository } from '../../ports/IExpenseRepository';
import type { UpdateExpenseDTO, ExpenseDTO } from '../../dtos/expense';
import { expenseMapper } from '../../mappers/ExpenseMapper';

export class UpdateExpenseUseCase {
  constructor(private readonly expenseRepository: IExpenseRepository) {}

  async execute(
    expenseId: string,
    userId: string,
    dto: UpdateExpenseDTO
  ): Promise<Result<ExpenseDTO, Error>> {
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

      // Update fields
      if (dto.description !== undefined) {
        expense.updateDescription(dto.description);
      }
      if (dto.amount !== undefined && dto.currency !== undefined) {
        expense.updateAmount(Money.create(dto.amount, dto.currency));
      }
      if (dto.category !== undefined) {
        expense.updateCategory(dto.category);
      }
      if (dto.date !== undefined) {
        expense.updateDate(dto.date);
      }
      if (dto.tags !== undefined) {
        expense.updateTags(dto.tags);
      }

      // Persist
      await this.expenseRepository.update(expense);

      return success(expenseMapper.toDTO(expense));
    } catch (error) {
      return failure(error as Error);
    }
  }
}
