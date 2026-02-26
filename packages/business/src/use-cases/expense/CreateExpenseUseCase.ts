import { Expense, Money } from 'hayahub-domain';
import { IdGenerator, success, failure, type Result } from 'hayahub-shared';
import type { IExpenseRepository } from '../../ports/IExpenseRepository';
import type { CreateExpenseDTO, ExpenseDTO } from '../../dtos/expense';
import { expenseMapper } from '../../mappers/ExpenseMapper';

export class CreateExpenseUseCase {
  constructor(private readonly expenseRepository: IExpenseRepository) {}

  async execute(dto: CreateExpenseDTO): Promise<Result<ExpenseDTO, Error>> {
    try {
      // Create domain entities
      const money = Money.create(dto.amount, dto.currency);
      const expense = Expense.create(
        IdGenerator.generateExpenseId(),
        dto.userId,
        dto.description,
        money,
        dto.category,
        dto.date,
        dto.tags || []
      );

      // Persist
      await this.expenseRepository.save(expense);

      // Return DTO
      return success(expenseMapper.toDTO(expense));
    } catch (error) {
      return failure(error as Error);
    }
  }
}
