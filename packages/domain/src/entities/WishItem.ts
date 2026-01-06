import { ValidationException } from '../exceptions/ValidationException';
import type { UserId } from '../value-objects/UserId';
import type { Money } from '../value-objects/Money';

export type WishItemId = string;

/**
 * WishItem Entity - Represents an item in wishlist
 */
export class WishItem {
  private constructor(
    private readonly _id: WishItemId,
    private readonly _userId: UserId,
    private _name: string,
    private _description: string,
    private _estimatedPrice: Money | null,
    private _priority: number,
    private _url: string | null,
    private _purchased: boolean,
    private _purchasedAt: Date | null,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {
    this.validate();
  }

  static create(
    id: WishItemId,
    userId: UserId,
    name: string,
    description: string = '',
    estimatedPrice: Money | null = null,
    priority: number = 3,
    url: string | null = null
  ): WishItem {
    return new WishItem(
      id,
      userId,
      name,
      description,
      estimatedPrice,
      priority,
      url,
      false,
      null,
      new Date(),
      new Date()
    );
  }

  static reconstruct(
    id: WishItemId,
    userId: UserId,
    name: string,
    description: string,
    estimatedPrice: Money | null,
    priority: number,
    url: string | null,
    purchased: boolean,
    purchasedAt: Date | null,
    createdAt: Date,
    updatedAt: Date
  ): WishItem {
    return new WishItem(
      id,
      userId,
      name,
      description,
      estimatedPrice,
      priority,
      url,
      purchased,
      purchasedAt,
      createdAt,
      updatedAt
    );
  }

  // Business logic
  updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new ValidationException('Item name cannot be empty');
    }
    this._name = name.trim();
    this._updatedAt = new Date();
  }

  updateDescription(description: string): void {
    this._description = description.trim();
    this._updatedAt = new Date();
  }

  setEstimatedPrice(price: Money): void {
    this._estimatedPrice = price;
    this._updatedAt = new Date();
  }

  removeEstimatedPrice(): void {
    this._estimatedPrice = null;
    this._updatedAt = new Date();
  }

  setPriority(priority: number): void {
    if (priority < 1 || priority > 5) {
      throw new ValidationException('Priority must be between 1 and 5');
    }
    this._priority = priority;
    this._updatedAt = new Date();
  }

  setUrl(url: string): void {
    this._url = url.trim();
    this._updatedAt = new Date();
  }

  removeUrl(): void {
    this._url = null;
    this._updatedAt = new Date();
  }

  markAsPurchased(): void {
    if (this._purchased) {
      throw new ValidationException('Item is already marked as purchased');
    }
    this._purchased = true;
    this._purchasedAt = new Date();
    this._updatedAt = new Date();
  }

  markAsUnpurchased(): void {
    if (!this._purchased) {
      throw new ValidationException('Item is not marked as purchased');
    }
    this._purchased = false;
    this._purchasedAt = null;
    this._updatedAt = new Date();
  }

  private validate(): void {
    if (!this._name || this._name.trim().length === 0) {
      throw new ValidationException('Item name is required');
    }
    if (this._priority < 1 || this._priority > 5) {
      throw new ValidationException('Priority must be between 1 and 5');
    }
  }

  // Getters
  get id(): WishItemId {
    return this._id;
  }

  get userId(): UserId {
    return this._userId;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get estimatedPrice(): Money | null {
    return this._estimatedPrice;
  }

  get priority(): number {
    return this._priority;
  }

  get url(): string | null {
    return this._url;
  }

  get purchased(): boolean {
    return this._purchased;
  }

  get purchasedAt(): Date | null {
    return this._purchasedAt;
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

  isHighPriority(): boolean {
    return this._priority >= 4;
  }

  hasUrl(): boolean {
    return this._url !== null && this._url.length > 0;
  }
}
