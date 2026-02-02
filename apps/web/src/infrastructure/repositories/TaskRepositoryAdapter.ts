import type { ITaskRepository } from 'hayahub-business';
import type { Task } from 'hayahub-domain';
import { Task as TaskDomain, TaskPriority } from 'hayahub-domain';
import type { IStorageService } from 'hayahub-business';

const STORAGE_KEY = 'hayahub_tasks';

interface TaskStorage {
  id: string;
  userId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  completed: boolean;
  projectId: string | null;
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Infrastructure Layer - Task Repository Adapter using LocalStorage
 */
export class TaskRepositoryAdapter implements ITaskRepository {
  constructor(private readonly storage: IStorageService) {}

  async save(task: Task): Promise<void> {
    const tasks = await this.loadAll();
    tasks.push(this.toStorage(task));
    await this.storage.set(STORAGE_KEY, tasks);
  }

  async findById(id: string): Promise<Task | null> {
    const tasks = await this.loadAll();
    const task = tasks.find((t) => t.id === id);
    return task ? this.toDomain(task) : null;
  }

  async findByUserId(userId: string): Promise<Task[]> {
    const tasks = await this.loadAll();
    return tasks.filter((t) => t.userId === userId).map(this.toDomain);
  }

  async findByProjectId(projectId: string): Promise<Task[]> {
    const tasks = await this.loadAll();
    return tasks.filter((t) => t.projectId === projectId).map(this.toDomain);
  }

  async update(task: Task): Promise<void> {
    const tasks = await this.loadAll();
    const index = tasks.findIndex((t) => t.id === task.id);
    if (index !== -1) {
      tasks[index] = this.toStorage(task);
      await this.storage.set(STORAGE_KEY, tasks);
    }
  }

  async delete(id: string): Promise<void> {
    const tasks = await this.loadAll();
    const filtered = tasks.filter((t) => t.id !== id);
    await this.storage.set(STORAGE_KEY, filtered);
  }

  private async loadAll(): Promise<TaskStorage[]> {
    return (await this.storage.get<TaskStorage[]>(STORAGE_KEY)) || [];
  }

  private toStorage(task: Task): TaskStorage {
    return {
      id: task.id,
      userId: task.userId,
      title: task.title,
      description: task.description,
      priority: task.priority,
      completed: task.completed,
      projectId: task.projectId,
      dueDate: task.dueDate?.toISOString() || null,
      completedAt: task.completedAt?.toISOString() || null,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    };
  }

  private toDomain(storage: TaskStorage): Task {
    return TaskDomain.reconstruct(
      storage.id,
      storage.userId,
      storage.title,
      storage.description,
      storage.priority,
      storage.completed,
      storage.projectId,
      storage.dueDate ? new Date(storage.dueDate) : null,
      storage.completedAt ? new Date(storage.completedAt) : null,
      new Date(storage.createdAt),
      new Date(storage.updatedAt)
    );
  }
}
