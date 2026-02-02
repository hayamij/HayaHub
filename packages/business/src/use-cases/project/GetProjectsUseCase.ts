import type { Project } from 'hayahub-domain';
import { success, failure, type Result } from 'hayahub-shared';
import type { IProjectRepository } from '../../ports/IProjectRepository';
import type { ProjectDTO } from '../../dtos/project';

export class GetProjectsUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(userId: string): Promise<Result<ProjectDTO[], Error>> {
    try {
      const projects = await this.projectRepository.findByUserId(userId);
      return success(projects.map((project) => this.toDTO(project)));
    } catch (error) {
      return failure(error as Error);
    }
  }

  private toDTO(project: Project): ProjectDTO {
    return {
      id: project.id,
      userId: project.userId,
      name: project.name,
      description: project.description,
      status: project.status,
      startDate: project.dateRange?.getStartDate() || null,
      endDate: project.dateRange?.getEndDate() || null,
      tags: project.tags,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }
}
