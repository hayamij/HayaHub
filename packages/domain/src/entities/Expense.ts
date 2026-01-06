import { ValidationException } from '../exceptions/ValidationException';
import { ExpenseCategory } from '../enums/ExpenseCategory';
import type { UserId } from '../value-objects/UserId';
import type { Money } from '../value-objects/Money';

export type ExpenseId = string;

/**
 * Expense Entity - Core domain entity for expense tracking
 */
export class Expense {
  private constructor(
    private readonly _id: ExpenseId,
    private readonly _userId: UserId,
    private _description: string,
    private _amount: Money,
    private _category: ExpenseCategory,
    private _date: Date,
    private _tags: string[],
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {
    this.validate();
  }

  static create(
    id: ExpenseId,
    userId: UserId,
    description: string,
    amount: Money,
    category: ExpenseCategory,
    date: Date,
    tags: string[] = []
  ): Expense {
    return new Expense(id, userId, description, amount, category, date, tags, new Date(), new Date());
  }

  static reconstruct(
    id: ExpenseId,
    userId: UserId,
    description: string,
    amount: Money,
    category: ExpenseCategory,
    date: Date,
    tags: string[],
    createdAt: Date,
    updatedAt: Date
  ): Expense {
    return new Expense(id, userId, description, amount, category, date, tags, createdAt, updatedAt);
  }

  // Business logic
  updateDescription(description: string): void {
    if (!description || description.trim().length === 0) {
      throw new ValidationException('Description cannot be empty');
    }
    this._description = description.trim();
    this._updatedAt = new Date();
  }

  updateAmount(amount: Money): void {
    this._amount = amount;
    this._updatedAt = new Date();
  }

  updateCategory(category: ExpenseCategory): void {
    this._category = category;
    this._updatedAt = new Date();
  }

  updateDate(date: Date): void {
    this._date = date;
    this._updatedAt = new Date();
  }

  addTag(tag: string): void {
    if (!this._tags.includes(tag)) {
      this._tags.push(tag);
      this._updatedAt = new Date();
    }
  }

  removeTag(tag: string): void {
    this._tags = this._tags.filter((t) => t !== tag);
    this._updatedAt = new Date();
  }

  private validate(): void {
    if (!this._description || this._description.trim().length === 0) {
      throw new ValidationException('Description is required');
    }
  }

  // Getters
  get id(): ExpenseId {
    return this._id;
  }

  get userId(): UserId {
    return this._userId;
  }

  get description(): string {
    return this._description;
  }

  get amount(): Money {
    return this._amount;
  }

  get category(): ExpenseCategory {
    return this._category;
  }

  get date(): Date {
    return this._date;
  }

  get tags(): string[] {
    return [...this._tags];
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Business rules
  isOwnedBy(userId: UserId): boolean {
    return this._userId === userId;
  }

  isInMonth(year: number, month: number): boolean {
    return this._date.getFullYear() === year && this._date.getMonth() === month;
  }
}
