import { success, failure, type Result } from 'hayahub-shared';
import type { IExpenseRepository } from '../../ports/IExpenseRepository';
import type { ExpenseDTO } from '../../dtos/expense';
import type { Expense } from 'hayahub-domain';
import { expenseMapper } from '../../mappers/ExpenseMapper';

export interface GetExpensesQuery {
  userId: string;
  startDate?: Date;
  endDate?: Date;
}

export class GetExpensesUseCase {
  constructor(private readonly expenseRepository: IExpenseRepository) {}

  async execute(query: GetExpensesQuery): Promise<Result<ExpenseDTO[], Error>> {
    try {
      let expenses: Expense[];

      if (query.startDate && query.endDate) {
        expenses = await this.expenseRepository.findByUserIdAndDateRange(
          query.userId,
          query.startDate,
          query.endDate
        );
      } else {
        expenses = await this.expenseRepository.findByUserId(query.userId);
      }

      const dtos = expenseMapper.toDTOs(expenses);
      return success(dtos);
    } catch (error) {
      return failure(error as Error);
    }
  }
}
