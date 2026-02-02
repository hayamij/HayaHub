import { success, failure, type Result } from 'hayahub-shared';
import type { ITaskRepository } from '../../ports/ITaskRepository';

export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: string): Promise<Result<void, Error>> {
    try {
      const task = await this.taskRepository.findById(id);
      if (!task) {
        return failure(new Error('Task not found'));
      }

      await this.taskRepository.delete(id);
      return success(undefined);
    } catch (error) {
      return failure(error as Error);
    }
  }
}
