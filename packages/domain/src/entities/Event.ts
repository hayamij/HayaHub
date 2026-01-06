import { ValidationException } from '../exceptions/ValidationException';
import type { UserId } from '../value-objects/UserId';

export type EventId = string;

/**
 * Event Entity - Represents a calendar event
 */
export class Event {
  private constructor(
    private readonly _id: EventId,
    private readonly _userId: UserId,
    private _title: string,
    private _description: string,
    private _startDate: Date,
    private _endDate: Date,
    private _location: string | null,
    private _isAllDay: boolean,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {
    this.validate();
  }

  static create(
    id: EventId,
    userId: UserId,
    title: string,
    startDate: Date,
    endDate: Date,
    description: string = '',
    location: string | null = null,
    isAllDay: boolean = false
  ): Event {
    return new Event(
      id,
      userId,
      title,
      description,
      startDate,
      endDate,
      location,
      isAllDay,
      new Date(),
      new Date()
    );
  }

  static reconstruct(
    id: EventId,
    userId: UserId,
    title: string,
    description: string,
    startDate: Date,
    endDate: Date,
    location: string | null,
    isAllDay: boolean,
    createdAt: Date,
    updatedAt: Date
  ): Event {
    return new Event(
      id,
      userId,
      title,
      description,
      startDate,
      endDate,
      location,
      isAllDay,
      createdAt,
      updatedAt
    );
  }

  // Business logic
  updateTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new ValidationException('Event title cannot be empty');
    }
    this._title = title.trim();
    this._updatedAt = new Date();
  }

  updateDescription(description: string): void {
    this._description = description.trim();
    this._updatedAt = new Date();
  }

  updateDates(startDate: Date, endDate: Date): void {
    if (endDate < startDate) {
      throw new ValidationException('End date cannot be before start date');
    }
    this._startDate = startDate;
    this._endDate = endDate;
    this._updatedAt = new Date();
  }

  setLocation(location: string): void {
    this._location = location.trim();
    this._updatedAt = new Date();
  }

  removeLocation(): void {
    this._location = null;
    this._updatedAt = new Date();
  }

  setAllDay(isAllDay: boolean): void {
    this._isAllDay = isAllDay;
    this._updatedAt = new Date();
  }

  private validate(): void {
    if (!this._title || this._title.trim().length === 0) {
      throw new ValidationException('Event title is required');
    }
    if (this._endDate < this._startDate) {
      throw new ValidationException('End date cannot be before start date');
    }
  }

  // Getters
  get id(): EventId {
    return this._id;
  }

  get userId(): UserId {
    return this._userId;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get startDate(): Date {
    return this._startDate;
  }

  get endDate(): Date {
    return this._endDate;
  }

  get location(): string | null {
    return this._location;
  }

  get isAllDay(): boolean {
    return this._isAllDay;
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

  isOngoing(now: Date = new Date()): boolean {
    return now >= this._startDate && now <= this._endDate;
  }

  isPast(now: Date = new Date()): boolean {
    return this._endDate < now;
  }

  isFuture(now: Date = new Date()): boolean {
    return this._startDate > now;
  }

  getDuration(): number {
    return this._endDate.getTime() - this._startDate.getTime();
  }
}
