import { ValidationException } from '../exceptions/ValidationException';
import type { UserId } from '../value-objects/UserId';
import type { Email } from '../value-objects/Email';
import { UserRole } from '../enums/UserRole';

/**
 * User Entity - Core domain entity
 * Represents a user in the HayaHub system
 */
export class User {
  private constructor(
    private readonly _id: UserId,
    private _email: Email,
    private _name: string,
    private _role: UserRole,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {
    this.validate();
  }

  // Factory method
  static create(id: UserId, email: Email, name: string, role: UserRole = UserRole.USER): User {
    return new User(id, email, name, role, new Date(), new Date());
  }

  // Reconstruction from persistence
  static reconstruct(
    id: UserId,
    email: Email,
    name: string,
    role: UserRole,
    createdAt: Date,
    updatedAt: Date
  ): User {
    return new User(id, email, name, role, createdAt, updatedAt);
  }

  // Business logic
  changeName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new ValidationException('Name cannot be empty');
    }
    this._name = newName.trim();
    this._updatedAt = new Date();
  }

  changeEmail(newEmail: Email): void {
    this._email = newEmail;
    this._updatedAt = new Date();
  }

  upgradeToAdmin(): void {
    this._role = UserRole.ADMIN;
    this._updatedAt = new Date();
  }

  // Validation
  private validate(): void {
    if (!this._name || this._name.trim().length === 0) {
      throw new ValidationException('Name is required');
    }
  }

  // Getters
  get id(): UserId {
    return this._id;
  }

  get email(): Email {
    return this._email;
  }

  get name(): string {
    return this._name;
  }

  get role(): UserRole {
    return this._role;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Domain business rules
  canManageUsers(): boolean {
    return this._role === UserRole.ADMIN;
  }

  canDeleteExpense(expenseUserId: UserId): boolean {
    return this._id === expenseUserId || this._role === UserRole.ADMIN;
  }
}
