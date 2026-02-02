import { success, failure, type Result } from 'hayahub-shared';
import type { IProjectRepository } from '../../ports/IProjectRepository';

export class DeleteProjectUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(id: string): Promise<Result<void, Error>> {
    try {
      const project = await this.projectRepository.findById(id);
      if (!project) {
        return failure(new Error('Project not found'));
      }

      await this.projectRepository.delete(id);
      return success(undefined);
    } catch (error) {
      return failure(error as Error);
    }
  }
}
