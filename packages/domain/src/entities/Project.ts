import { ValidationException } from '../exceptions/ValidationException';
import { ProjectStatus } from '../enums/ProjectStatus';
import type { UserId } from '../value-objects/UserId';
import type { DateRange } from '../value-objects/DateRange';

export type ProjectId = string;

/**
 * Project Entity - Represents a project in project management
 */
export class Project {
  private constructor(
    private readonly _id: ProjectId,
    private readonly _userId: UserId,
    private _name: string,
    private _description: string,
    private _status: ProjectStatus,
    private _dateRange: DateRange | null,
    private _tags: string[],
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {
    this.validate();
  }

  static create(
    id: ProjectId,
    userId: UserId,
    name: string,
    description: string = '',
    dateRange: DateRange | null = null
  ): Project {
    return new Project(
      id,
      userId,
      name,
      description,
      ProjectStatus.PLANNING,
      dateRange,
      [],
      new Date(),
      new Date()
    );
  }

  static reconstruct(
    id: ProjectId,
    userId: UserId,
    name: string,
    description: string,
    status: ProjectStatus,
    dateRange: DateRange | null,
    tags: string[],
    createdAt: Date,
    updatedAt: Date
  ): Project {
    return new Project(id, userId, name, description, status, dateRange, tags, createdAt, updatedAt);
  }

  // Business logic
  updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new ValidationException('Project name cannot be empty');
    }
    this._name = name.trim();
    this._updatedAt = new Date();
  }

  updateDescription(description: string): void {
    this._description = description.trim();
    this._updatedAt = new Date();
  }

  start(): void {
    if (this._status !== ProjectStatus.PLANNING) {
      throw new ValidationException('Can only start projects in planning status');
    }
    this._status = ProjectStatus.IN_PROGRESS;
    this._updatedAt = new Date();
  }

  complete(): void {
    if (this._status !== ProjectStatus.IN_PROGRESS) {
      throw new ValidationException('Can only complete projects that are in progress');
    }
    this._status = ProjectStatus.COMPLETED;
    this._updatedAt = new Date();
  }

  archive(): void {
    this._status = ProjectStatus.ARCHIVED;
    this._updatedAt = new Date();
  }

  setDateRange(dateRange: DateRange): void {
    this._dateRange = dateRange;
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
    if (!this._name || this._name.trim().length === 0) {
      throw new ValidationException('Project name is required');
    }
  }

  // Getters
  get id(): ProjectId {
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

  get status(): ProjectStatus {
    return this._status;
  }

  get dateRange(): DateRange | null {
    return this._dateRange;
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

  isActive(): boolean {
    return this._status === ProjectStatus.IN_PROGRESS;
  }

  canBeDeleted(): boolean {
    return this._status === ProjectStatus.ARCHIVED || this._status === ProjectStatus.PLANNING;
  }
}
