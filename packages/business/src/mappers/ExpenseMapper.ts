import type { Expense } from 'hayahub-domain';
import type { ExpenseDTO } from '../dtos/expense';
import { BaseMapper } from './BaseMapper';

/**
 * Expense Mapper
 * Centralized mapping logic for Expense entity
 */
export class ExpenseMapper extends BaseMapper<Expense, ExpenseDTO> {
  toDTO(expense: Expense): ExpenseDTO {
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

export const expenseMapper = new ExpenseMapper();
