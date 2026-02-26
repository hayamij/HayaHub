import type { Project } from 'hayahub-domain';
import type { ProjectDTO } from '../dtos/project';
import { BaseMapper } from './BaseMapper';

/**
 * Project Mapper
 * Centralized mapping logic for Project entity
 * Eliminates duplicate toDTO() methods across use cases
 */
export class ProjectMapper extends BaseMapper<Project, ProjectDTO> {
  toDTO(project: Project): ProjectDTO {
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

// Singleton instance for reuse
export const projectMapper = new ProjectMapper();
