'use client';

import { container } from '@/infrastructure/di/Container';
import type { ProjectDTO, CreateProjectDTO, UpdateProjectDTO } from 'hayahub-business';
import { useEntityCRUD } from './useEntityCRUD';

interface UseProjectsReturn {
  projects: ProjectDTO[];
  isLoading: boolean;
  error: Error | null;
  loadProjects: () => Promise<void>;
  createProject: (dto: CreateProjectDTO) => Promise<boolean>;
  updateProject: (id: string, dto: UpdateProjectDTO) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
}

/**
 * Custom Hook for Project Management
 * Uses generic useEntityCRUD to eliminate code duplication
 */
export function useProjects(userId: string | undefined): UseProjectsReturn {
  const {
    entities: projects,
    isLoading,
    error,
    load: loadProjects,
    create: createProject,
    update: updateProject,
    deleteEntity: deleteProject,
  } = useEntityCRUD<ProjectDTO, CreateProjectDTO, UpdateProjectDTO>({
    getUseCase: container.getProjectsUseCase,
    createUseCase: container.createProjectUseCase,
    updateUseCase: container.updateProjectUseCase,
    deleteUseCase: container.deleteProjectUseCase,
    getParams: userId!,
  });

  return {
    projects,
    isLoading,
    error,
    loadProjects,
    createProject,
    updateProject,
    deleteProject,
  };
}
