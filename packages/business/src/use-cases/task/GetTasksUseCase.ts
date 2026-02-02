import type { Task } from 'hayahub-domain';
import { success, failure, type Result } from 'hayahub-shared';
import type { ITaskRepository } from '../../ports/ITaskRepository';
import type { TaskDTO } from '../../dtos/task';

export class GetTasksUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async executeByUser(userId: string): Promise<Result<TaskDTO[], Error>> {
    try {
      const tasks = await this.taskRepository.findByUserId(userId);
      return success(tasks.map((task) => this.toDTO(task)));
    } catch (error) {
      return failure(error as Error);
    }
  }

  async executeByProject(projectId: string): Promise<Result<TaskDTO[], Error>> {
    try {
      const tasks = await this.taskRepository.findByProjectId(projectId);
      return success(tasks.map((task) => this.toDTO(task)));
    } catch (error) {
      return failure(error as Error);
    }
  }

  private toDTO(task: Task): TaskDTO {
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
