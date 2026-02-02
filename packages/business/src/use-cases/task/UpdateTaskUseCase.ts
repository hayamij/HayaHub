import type { Task } from 'hayahub-domain';
import { success, failure, type Result } from 'hayahub-shared';
import type { ITaskRepository } from '../../ports/ITaskRepository';
import type { UpdateTaskDTO, TaskDTO } from '../../dtos/task';

export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: string, dto: UpdateTaskDTO): Promise<Result<TaskDTO, Error>> {
    try {
      // Find existing task
      const task = await this.taskRepository.findById(id);
      if (!task) {
        return failure(new Error('Task not found'));
      }

      // Update fields using domain methods
      if (dto.title !== undefined) {
        task.updateTitle(dto.title);
      }

      if (dto.description !== undefined) {
        task.updateDescription(dto.description);
      }

      if (dto.priority !== undefined) {
        task.setPriority(dto.priority);
      }

      if (dto.projectId !== undefined) {
        task.assignToProject(dto.projectId);
      }

      if (dto.dueDate !== undefined) {
        task.setDueDate(dto.dueDate);
      }

      // Handle completion toggle
      if (dto.completed !== undefined) {
        if (dto.completed && !task.completed) {
          task.complete();
        } else if (!dto.completed && task.completed) {
          task.uncomplete();
        }
      }

      // Persist
      await this.taskRepository.update(task);

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
