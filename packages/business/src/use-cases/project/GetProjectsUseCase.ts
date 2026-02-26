import { success, failure, type Result } from 'hayahub-shared';
import type { IProjectRepository } from '../../ports/IProjectRepository';
import type { ProjectDTO } from '../../dtos/project';
import { projectMapper } from '../../mappers/ProjectMapper';

export class GetProjectsUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(userId: string): Promise<Result<ProjectDTO[], Error>> {
    try {
      const projects = await this.projectRepository.findByUserId(userId);
      return success(projectMapper.toDTOs(projects));
    } catch (error) {
      return failure(error as Error);
    }
  }
}
