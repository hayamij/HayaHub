import type { IExpenseRepository } from 'hayahub-business';
import type { Expense } from 'hayahub-domain';
import { Expense as ExpenseDomain, Money, ExpenseCategory } from 'hayahub-domain';
import type { IStorageService } from 'hayahub-business';

const STORAGE_KEY = 'hayahub_expenses';

interface ExpenseStorage {
  id: string;
  userId: string;
  description: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  date: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Infrastructure Layer - Expense Repository Adapter using LocalStorage
 */
export class ExpenseRepositoryAdapter implements IExpenseRepository {
  constructor(private readonly storage: IStorageService) {}

  async save(expense: Expense): Promise<void> {
    const expenses = await this.loadAll();
    expenses.push(this.toStorage(expense));
    await this.storage.set(STORAGE_KEY, expenses);
  }

  async findById(id: string): Promise<Expense | null> {
    const expenses = await this.loadAll();
    const expense = expenses.find((e) => e.id === id);
    return expense ? this.toDomain(expense) : null;
  }

  async findByUserId(userId: string): Promise<Expense[]> {
    const expenses = await this.loadAll();
    return expenses.filter((e) => e.userId === userId).map(this.toDomain);
  }

  async findByUserIdAndDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Expense[]> {
    const expenses = await this.loadAll();
    return expenses
      .filter((e) => {
        const expenseDate = new Date(e.date);
        return e.userId === userId && expenseDate >= startDate && expenseDate <= endDate;
      })
      .map(this.toDomain);
  }

  async update(expense: Expense): Promise<void> {
    const expenses = await this.loadAll();
    const index = expenses.findIndex((e) => e.id === expense.id);
    if (index !== -1) {
      expenses[index] = this.toStorage(expense);
      await this.storage.set(STORAGE_KEY, expenses);
    }
  }

  async delete(id: string): Promise<void> {
    const expenses = await this.loadAll();
    const filtered = expenses.filter((e) => e.id !== id);
    await this.storage.set(STORAGE_KEY, filtered);
  }

  async findAll(): Promise<Expense[]> {
    const expenses = await this.loadAll();
    return expenses.map(this.toDomain);
  }

  private async loadAll(): Promise<ExpenseStorage[]> {
    return (await this.storage.get<ExpenseStorage[]>(STORAGE_KEY)) || [];
  }

  private toStorage(expense: Expense): ExpenseStorage {
    return {
      id: expense.id,
      userId: expense.userId,
      description: expense.description,
      amount: expense.amount.getAmount(),
      currency: expense.amount.getCurrency(),
      category: expense.category,
      date: expense.date.toISOString(),
      tags: expense.tags,
      createdAt: expense.createdAt.toISOString(),
      updatedAt: expense.updatedAt.toISOString(),
    };
  }

  private toDomain(storage: ExpenseStorage): Expense {
    return ExpenseDomain.reconstruct(
      storage.id,
      storage.userId,
      storage.description,
      Money.create(storage.amount, storage.currency),
      storage.category,
      new Date(storage.date),
      storage.tags,
      new Date(storage.createdAt),
      new Date(storage.updatedAt)
    );
  }
}
