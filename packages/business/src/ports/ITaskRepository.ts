import type { Task } from 'hayahub-domain';

/**
 * Port (Interface) for Task Repository
 */
export interface ITaskRepository {
  save(task: Task): Promise<void>;
  findById(id: string): Promise<Task | null>;
  findByUserId(userId: string): Promise<Task[]>;
  findByProjectId(projectId: string): Promise<Task[]>;
  update(task: Task): Promise<void>;
  delete(id: string): Promise<void>;
}
