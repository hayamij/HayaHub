import { DateRange, type Project, ProjectStatus } from 'hayahub-domain';
import { success, failure, type Result } from 'hayahub-shared';
import type { IProjectRepository } from '../../ports/IProjectRepository';
import type { UpdateProjectDTO, ProjectDTO } from '../../dtos/project';
import { projectMapper } from '../../mappers/ProjectMapper';

export class UpdateProjectUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(id: string, dto: UpdateProjectDTO): Promise<Result<ProjectDTO, Error>> {
    try {
      // Find existing project
      const project = await this.projectRepository.findById(id);
      if (!project) {
        return failure(new Error('Project not found'));
      }

      // Update fields using domain methods
      if (dto.name !== undefined) {
        project.updateName(dto.name);
      }

      if (dto.description !== undefined) {
        project.updateDescription(dto.description);
      }

      if (dto.startDate !== undefined && dto.endDate !== undefined) {
        const dateRange = DateRange.create(dto.startDate, dto.endDate);
        project.setDateRange(dateRange);
      }

      // Handle status transitions using domain methods
      if (dto.status !== undefined && dto.status !== project.status) {
        this.updateStatus(project, dto.status);
      }

      // Persist
      await this.projectRepository.update(project);

      // Return DTO using centralized mapper
      return success(projectMapper.toDTO(project));
    } catch (error) {
      return failure(error as Error);
    }
  }

  private updateStatus(project: Project, newStatus: ProjectStatus): void {
    switch (newStatus) {
      case ProjectStatus.IN_PROGRESS:
        project.start();
        break;
      case ProjectStatus.COMPLETED:
        project.complete();
        break;
      case ProjectStatus.ARCHIVED:
        project.archive();
        break;
      // PLANNING status is default, no action needed
    }
  }
}
