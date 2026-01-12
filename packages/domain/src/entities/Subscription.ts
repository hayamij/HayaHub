import { ValidationException } from '../exceptions/ValidationException';
import type { UserId } from '../value-objects/UserId';
import type { Money } from '../value-objects/Money';

export type SubscriptionId = string;

export enum SubscriptionFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  CANCELLED = 'CANCELLED',
}

/**
 * Subscription Entity - Recurring payment tracking
 */
export class Subscription {
  private constructor(
    private readonly _id: SubscriptionId,
    private readonly _userId: UserId,
    private _name: string,
    private _amount: Money,
    private _frequency: SubscriptionFrequency,
    private _status: SubscriptionStatus,
    private _startDate: Date,
    private _nextBillingDate: Date,
    private _description?: string,
    private readonly _createdAt: Date = new Date(),
    private _updatedAt: Date = new Date()
  ) {
    this.validate();
  }

  static create(
    id: SubscriptionId,
    userId: UserId,
    name: string,
    amount: Money,
    frequency: SubscriptionFrequency,
    startDate: Date,
    description?: string
  ): Subscription {
    const nextBillingDate = Subscription.calculateNextBillingDate(startDate, frequency);
    return new Subscription(
      id,
      userId,
      name,
      amount,
      frequency,
      SubscriptionStatus.ACTIVE,
      startDate,
      nextBillingDate,
      description
    );
  }

  static reconstruct(
    id: SubscriptionId,
    userId: UserId,
    name: string,
    amount: Money,
    frequency: SubscriptionFrequency,
    status: SubscriptionStatus,
    startDate: Date,
    nextBillingDate: Date,
    description: string | undefined,
    createdAt: Date,
    updatedAt: Date
  ): Subscription {
    return new Subscription(
      id,
      userId,
      name,
      amount,
      frequency,
      status,
      startDate,
      nextBillingDate,
      description,
      createdAt,
      updatedAt
    );
  }

  // Business logic
  pause(): void {
    if (this._status === SubscriptionStatus.CANCELLED) {
      throw new ValidationException('Cannot pause a cancelled subscription');
    }
    this._status = SubscriptionStatus.PAUSED;
    this._updatedAt = new Date();
  }

  resume(): void {
    if (this._status !== SubscriptionStatus.PAUSED) {
      throw new ValidationException('Can only resume paused subscriptions');
    }
    this._status = SubscriptionStatus.ACTIVE;
    this._updatedAt = new Date();
  }

  cancel(): void {
    this._status = SubscriptionStatus.CANCELLED;
    this._updatedAt = new Date();
  }

  updateAmount(amount: Money): void {
    this._amount = amount;
    this._updatedAt = new Date();
  }

  updateFrequency(frequency: SubscriptionFrequency): void {
    this._frequency = frequency;
    this._nextBillingDate = Subscription.calculateNextBillingDate(new Date(), frequency);
    this._updatedAt = new Date();
  }

  markBilled(): void {
    this._nextBillingDate = Subscription.calculateNextBillingDate(
      this._nextBillingDate,
      this._frequency
    );
    this._updatedAt = new Date();
  }

  private static calculateNextBillingDate(from: Date, frequency: SubscriptionFrequency): Date {
    const next = new Date(from);
    switch (frequency) {
      case SubscriptionFrequency.DAILY:
        next.setDate(next.getDate() + 1);
        break;
      case SubscriptionFrequency.WEEKLY:
        next.setDate(next.getDate() + 7);
        break;
      case SubscriptionFrequency.MONTHLY:
        next.setMonth(next.getMonth() + 1);
        break;
      case SubscriptionFrequency.YEARLY:
        next.setFullYear(next.getFullYear() + 1);
        break;
    }
    return next;
  }

  private validate(): void {
    if (!this._name || this._name.trim().length === 0) {
      throw new ValidationException('Subscription name is required');
    }
  }

  // Getters
  get id(): SubscriptionId {
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

  get frequency(): SubscriptionFrequency {
    return this._frequency;
  }

  get status(): SubscriptionStatus {
    return this._status;
  }

  get startDate(): Date {
    return this._startDate;
  }

  get nextBillingDate(): Date {
    return this._nextBillingDate;
  }

  get description(): string | undefined {
    return this._description;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  isActive(): boolean {
    return this._status === SubscriptionStatus.ACTIVE;
  }

  isDue(): boolean {
    return this.isActive() && this._nextBillingDate <= new Date();
  }
}
