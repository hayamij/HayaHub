import { ValidationException } from '../exceptions/ValidationException';
import { TaskPriority } from '../enums/TaskPriority';
import type { UserId } from '../value-objects/UserId';
import type { ProjectId } from './Project';

export type TaskId = string;

/**
 * Task Entity - Represents a todo item
 */
export class Task {
  private constructor(
    private readonly _id: TaskId,
    private readonly _userId: UserId,
    private _title: string,
    private _description: string,
    private _priority: TaskPriority,
    private _completed: boolean,
    private _projectId: ProjectId | null,
    private _dueDate: Date | null,
    private _completedAt: Date | null,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {
    this.validate();
  }

  static create(
    id: TaskId,
    userId: UserId,
    title: string,
    description: string = '',
    priority: TaskPriority = TaskPriority.MEDIUM,
    projectId: ProjectId | null = null,
    dueDate: Date | null = null
  ): Task {
    return new Task(
      id,
      userId,
      title,
      description,
      priority,
      false,
      projectId,
      dueDate,
      null,
      new Date(),
      new Date()
    );
  }

  static reconstruct(
    id: TaskId,
    userId: UserId,
    title: string,
    description: string,
    priority: TaskPriority,
    completed: boolean,
    projectId: ProjectId | null,
    dueDate: Date | null,
    completedAt: Date | null,
    createdAt: Date,
    updatedAt: Date
  ): Task {
    return new Task(
      id,
      userId,
      title,
      description,
      priority,
      completed,
      projectId,
      dueDate,
      completedAt,
      createdAt,
      updatedAt
    );
  }

  // Business logic
  updateTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new ValidationException('Task title cannot be empty');
    }
    this._title = title.trim();
    this._updatedAt = new Date();
  }

  updateDescription(description: string): void {
    this._description = description.trim();
    this._updatedAt = new Date();
  }

  setPriority(priority: TaskPriority): void {
    this._priority = priority;
    this._updatedAt = new Date();
  }

  complete(): void {
    if (this._completed) {
      throw new ValidationException('Task is already completed');
    }
    this._completed = true;
    this._completedAt = new Date();
    this._updatedAt = new Date();
  }

  uncomplete(): void {
    if (!this._completed) {
      throw new ValidationException('Task is not completed');
    }
    this._completed = false;
    this._completedAt = null;
    this._updatedAt = new Date();
  }

  assignToProject(projectId: ProjectId): void {
    this._projectId = projectId;
    this._updatedAt = new Date();
  }

  removeFromProject(): void {
    this._projectId = null;
    this._updatedAt = new Date();
  }

  setDueDate(dueDate: Date): void {
    this._dueDate = dueDate;
    this._updatedAt = new Date();
  }

  removeDueDate(): void {
    this._dueDate = null;
    this._updatedAt = new Date();
  }

  private validate(): void {
    if (!this._title || this._title.trim().length === 0) {
      throw new ValidationException('Task title is required');
    }
  }

  // Getters
  get id(): TaskId {
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

  get priority(): TaskPriority {
    return this._priority;
  }

  get completed(): boolean {
    return this._completed;
  }

  get projectId(): ProjectId | null {
    return this._projectId;
  }

  get dueDate(): Date | null {
    return this._dueDate;
  }

  get completedAt(): Date | null {
    return this._completedAt;
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

  isOverdue(): boolean {
    if (!this._dueDate || this._completed) return false;
    return this._dueDate < new Date();
  }

  isHighPriority(): boolean {
    return this._priority === TaskPriority.HIGH || this._priority === TaskPriority.URGENT;
  }
}
