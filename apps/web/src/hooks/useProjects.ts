'use client';

import { useMemo } from 'react';
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
  // Memoize use cases to prevent getter re-evaluation
  const getProjectsUseCase = useMemo(() => container.getProjectsUseCase, []);
  const createProjectUseCase = useMemo(() => container.createProjectUseCase, []);
  const updateProjectUseCase = useMemo(() => container.updateProjectUseCase, []);
  const deleteProjectUseCase = useMemo(() => container.deleteProjectUseCase, []);
  
  const {
    entities: projects,
    isLoading,
    error,
    load: loadProjects,
    create: createProject,
    update: updateProject,
    deleteEntity: deleteProject,
  } = useEntityCRUD<ProjectDTO, CreateProjectDTO, UpdateProjectDTO>({
    getUseCase: getProjectsUseCase,
    createUseCase: createProjectUseCase,
    updateUseCase: updateProjectUseCase,
    deleteUseCase: deleteProjectUseCase,
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
