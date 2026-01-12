import { ValidationException } from '../exceptions/ValidationException';
import type { UserId } from '../value-objects/UserId';

export type CalendarEventId = string;

export enum EventPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

/**
 * CalendarEvent Entity - Calendar and scheduling
 */
export class CalendarEvent {
  private constructor(
    private readonly _id: CalendarEventId,
    private readonly _userId: UserId,
    private _title: string,
    private _description: string,
    private _startDate: Date,
    private _endDate: Date,
    private _location?: string,
    private _priority: EventPriority = EventPriority.MEDIUM,
    private _isAllDay: boolean = false,
    private _reminders: number[] = [],
    private readonly _createdAt: Date = new Date(),
    private _updatedAt: Date = new Date()
  ) {
    this.validate();
  }

  static create(
    id: CalendarEventId,
    userId: UserId,
    title: string,
    description: string,
    startDate: Date,
    endDate: Date,
    location?: string,
    priority: EventPriority = EventPriority.MEDIUM,
    isAllDay: boolean = false
  ): CalendarEvent {
    return new CalendarEvent(
      id,
      userId,
      title,
      description,
      startDate,
      endDate,
      location,
      priority,
      isAllDay
    );
  }

  static reconstruct(
    id: CalendarEventId,
    userId: UserId,
    title: string,
    description: string,
    startDate: Date,
    endDate: Date,
    location: string | undefined,
    priority: EventPriority,
    isAllDay: boolean,
    reminders: number[],
    createdAt: Date,
    updatedAt: Date
  ): CalendarEvent {
    return new CalendarEvent(
      id,
      userId,
      title,
      description,
      startDate,
      endDate,
      location,
      priority,
      isAllDay,
      reminders,
      createdAt,
      updatedAt
    );
  }

  // Business logic
  updateTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new ValidationException('Title cannot be empty');
    }
    this._title = title.trim();
    this._updatedAt = new Date();
  }

  updateDescription(description: string): void {
    this._description = description;
    this._updatedAt = new Date();
  }

  reschedule(startDate: Date, endDate: Date): void {
    if (endDate <= startDate) {
      throw new ValidationException('End date must be after start date');
    }
    this._startDate = startDate;
    this._endDate = endDate;
    this._updatedAt = new Date();
  }

  updateLocation(location: string): void {
    this._location = location;
    this._updatedAt = new Date();
  }

  setPriority(priority: EventPriority): void {
    this._priority = priority;
    this._updatedAt = new Date();
  }

  addReminder(minutesBefore: number): void {
    if (minutesBefore < 0) {
      throw new ValidationException('Reminder minutes must be positive');
    }
    if (!this._reminders.includes(minutesBefore)) {
      this._reminders.push(minutesBefore);
      this._updatedAt = new Date();
    }
  }

  removeReminder(minutesBefore: number): void {
    this._reminders = this._reminders.filter((r) => r !== minutesBefore);
    this._updatedAt = new Date();
  }

  private validate(): void {
    if (!this._title || this._title.trim().length === 0) {
      throw new ValidationException('Event title is required');
    }
    if (this._endDate <= this._startDate) {
      throw new ValidationException('End date must be after start date');
    }
  }

  // Getters
  get id(): CalendarEventId {
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

  get location(): string | undefined {
    return this._location;
  }

  get priority(): EventPriority {
    return this._priority;
  }

  get isAllDay(): boolean {
    return this._isAllDay;
  }

  get reminders(): number[] {
    return [...this._reminders];
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  isUpcoming(): boolean {
    return this._startDate > new Date();
  }

  isOngoing(): boolean {
    const now = new Date();
    return this._startDate <= now && this._endDate >= now;
  }

  isPast(): boolean {
    return this._endDate < new Date();
  }
}
