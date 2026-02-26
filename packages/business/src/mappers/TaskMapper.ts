import type { Task } from 'hayahub-domain';
import type { TaskDTO } from '../dtos/task';
import { BaseMapper } from './BaseMapper';

/**
 * Task Mapper
 * Centralized mapping logic for Task entity
 */
export class TaskMapper extends BaseMapper<Task, TaskDTO> {
  toDTO(task: Task): TaskDTO {
    return {
      id: task.id,
      userId: task.userId,
      title: task.title,
      description: task.description,
      priority: task.priority,
      completed: task.completed,
      projectId: task.projectId,
      dueDate: task.dueDate,
      completedAt: task.completedAt,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }
}

export const taskMapper = new TaskMapper();
