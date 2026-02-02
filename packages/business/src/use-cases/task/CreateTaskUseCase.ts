import { Task } from 'hayahub-domain';
import { IdGenerator, success, failure, type Result } from 'hayahub-shared';
import type { ITaskRepository } from '../../ports/ITaskRepository';
import type { CreateTaskDTO, TaskDTO } from '../../dtos/task';

export class CreateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(dto: CreateTaskDTO): Promise<Result<TaskDTO, Error>> {
    try {
      // Create domain entity
      const task = Task.create(
        IdGenerator.generateTaskId(),
        dto.userId,
        dto.title,
        dto.description || '',
        dto.priority,
        dto.projectId || null,
        dto.dueDate || null
      );

      // Persist
      await this.taskRepository.save(task);

      // Return DTO
      return success(this.toDTO(task));
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
