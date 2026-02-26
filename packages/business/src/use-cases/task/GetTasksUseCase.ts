import { success, failure, type Result } from 'hayahub-shared';
import type { ITaskRepository } from '../../ports/ITaskRepository';
import type { TaskDTO } from '../../dtos/task';
import { taskMapper } from '../../mappers/TaskMapper';

export class GetTasksUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async executeByUser(userId: string): Promise<Result<TaskDTO[], Error>> {
    try {
      const tasks = await this.taskRepository.findByUserId(userId);
      return success(taskMapper.toDTOs(tasks));
    } catch (error) {
      return failure(error as Error);
    }
  }

  async executeByProject(projectId: string): Promise<Result<TaskDTO[], Error>> {
    try {
      const tasks = await this.taskRepository.findByProjectId(projectId);
      return success(taskMapper.toDTOs(tasks));
    } catch (error) {
      return failure(error as Error);
    }
  }
}
