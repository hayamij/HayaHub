import { Project, DateRange } from 'hayahub-domain';
import { IdGenerator, success, failure, type Result } from 'hayahub-shared';
import type { IProjectRepository } from '../../ports/IProjectRepository';
import type { CreateProjectDTO, ProjectDTO } from '../../dtos/project';

export class CreateProjectUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(dto: CreateProjectDTO): Promise<Result<ProjectDTO, Error>> {
    try {
      // Create DateRange value object if dates provided
      let dateRange: DateRange | null = null;
      if (dto.startDate && dto.endDate) {
        dateRange = DateRange.create(dto.startDate, dto.endDate);
      }

      // Create domain entity
      const project = Project.create(
        IdGenerator.generateProjectId(),
        dto.userId,
        dto.name,
        dto.description || '',
        dateRange
      );

      // Persist
      await this.projectRepository.save(project);

      // Return DTO
      return success(this.toDTO(project));
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
