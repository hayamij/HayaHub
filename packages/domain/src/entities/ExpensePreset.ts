import { ValidationException } from '../exceptions/ValidationException';
import { ExpenseCategory } from '../enums/ExpenseCategory';
import type { UserId } from '../value-objects/UserId';
import type { Money } from '../value-objects/Money';

export type ExpensePresetId = string;

/**
 * ExpensePreset Entity - Domain entity for quick expense entry presets
 * Business Rules:
 * - Preset name must not be empty
 * - Amount must be positive
 * - Each preset belongs to exactly one user
 * - Each preset must have a category
 * - Notes are optional
 */
export class ExpensePreset {
  private constructor(
    private readonly _id: ExpensePresetId,
    private readonly _userId: UserId,
    private _name: string,
    private _amount: Money,
    private _category: ExpenseCategory,
    private _notes: string,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {
    this.validate();
  }

  /**
   * Factory method for creating a new preset
   */
  static create(
    id: ExpensePresetId,
    userId: UserId,
    name: string,
    amount: Money,
    category: ExpenseCategory,
    notes: string = ''
  ): ExpensePreset {
    return new ExpensePreset(
      id,
      userId,
      name,
      amount,
      category,
      notes,
      new Date(),
      new Date()
    );
  }

  /**
   * Factory method for reconstructing preset from persistence
   */
  static reconstruct(
    id: ExpensePresetId,
    userId: UserId,
    name: string,
    amount: Money,
    category: ExpenseCategory,
    notes: string,
    createdAt: Date,
    updatedAt: Date
  ): ExpensePreset {
    return new ExpensePreset(
      id,
      userId,
      name,
      amount,
      category,
      notes,
      createdAt,
      updatedAt
    );
  }

  /**
   * Static validation for preset creation input
   */
  static checkInputForCreate(
    name: string,
    _amount: Money,
    category: ExpenseCategory
  ): void {
    if (!name || name.trim().length === 0) {
      throw new ValidationException('Preset name cannot be empty');
    }
    if (name.trim().length > 100) {
      throw new ValidationException('Preset name cannot exceed 100 characters');
    }
    if (!category) {
      throw new ValidationException('Category is required');
    }
  }

  // Business logic methods

  /**
   * Update preset name
   */
  updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new ValidationException('Preset name cannot be empty');
    }
    if (name.trim().length > 100) {
      throw new ValidationException('Preset name cannot exceed 100 characters');
    }
    this._name = name.trim();
    this._updatedAt = new Date();
  }

  /**
   * Update preset amount
   */
  updateAmount(amount: Money): void {
    this._amount = amount;
    this._updatedAt = new Date();
  }

  /**
   * Update preset category
   */
  updateCategory(category: ExpenseCategory): void {
    if (!category) {
      throw new ValidationException('Category is required');
    }
    this._category = category;
    this._updatedAt = new Date();
  }

  /**
   * Update preset notes
   */
  updateNotes(notes: string): void {
    if (notes && notes.length > 500) {
      throw new ValidationException('Notes cannot exceed 500 characters');
    }
    this._notes = notes || '';
    this._updatedAt = new Date();
  }

  /**
   * Check if this preset matches a given category
   */
  belongsToCategory(category: ExpenseCategory): boolean {
    return this._category === category;
  }

  /**
   * Internal validation
   */
  private validate(): void {
    if (!this._name || this._name.trim().length === 0) {
      throw new ValidationException('Preset name is required');
    }
    if (this._name.trim().length > 100) {
      throw new ValidationException('Preset name cannot exceed 100 characters');
    }
    if (!this._category) {
      throw new ValidationException('Category is required');
    }
    if (this._notes && this._notes.length > 500) {
      throw new ValidationException('Notes cannot exceed 500 characters');
    }
  }

  // Getters
  get id(): ExpensePresetId {
    return this._id;
  }

  get userId(): UserId {
    return this._userId;
  }

  get name(): string {
    return this._name;
  }

  get amount(): Money {
    return this._amount;
  }

  get category(): ExpenseCategory {
    return this._category;
  }

  get notes(): string {
    return this._notes;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
