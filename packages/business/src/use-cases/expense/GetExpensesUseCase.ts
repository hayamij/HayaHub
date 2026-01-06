import { success, failure, type Result } from 'hayahub-shared';
import type { IExpenseRepository } from '../../ports/IExpenseRepository';
import type { ExpenseDTO } from '../../dtos/expense';
import type { Expense } from 'hayahub-domain';

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

      const dtos = expenses.map(this.toDTO);
      return success(dtos);
    } catch (error) {
      return failure(error as Error);
    }
  }

  private toDTO(expense: Expense): ExpenseDTO {
    return {
      id: expense.id,
      userId: expense.userId,
      description: expense.description,
      amount: expense.amount.getAmount(),
      currency: expense.amount.getCurrency(),
      category: expense.category,
      date: expense.date,
      tags: expense.tags,
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt,
    };
  }
}
