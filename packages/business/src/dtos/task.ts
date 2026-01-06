import type { TaskPriority } from 'hayahub-domain';

export interface CreateTaskDTO {
  userId: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  projectId?: string;
  dueDate?: Date;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  projectId?: string;
  dueDate?: Date;
  completed?: boolean;
}

export interface TaskDTO {
  id: string;
  userId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  completed: boolean;
  projectId: string | null;
  dueDate: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
