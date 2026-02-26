import { Task } from 'hayahub-domain';
import { IdGenerator, success, failure, type Result } from 'hayahub-shared';
import type { ITaskRepository } from '../../ports/ITaskRepository';
import type { CreateTaskDTO, TaskDTO } from '../../dtos/task';
import { taskMapper } from '../../mappers/TaskMapper';

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

      // Return DTO using centralized mapper
      return success(taskMapper.toDTO(task));
    } catch (error) {
      return failure(error as Error);
    }
  }
}
