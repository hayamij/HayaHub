'use client';

import { useState, useCallback, useEffect } from 'react';
import { Container } from '@/infrastructure/di/Container';
import type { ProjectDTO, CreateProjectDTO, UpdateProjectDTO } from 'hayahub-business';

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
 */
export function useProjects(userId: string | undefined): UseProjectsReturn {
  const [projects, setProjects] = useState<ProjectDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadProjects = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const getProjectsUseCase = Container.getProjectsUseCase();
      const result = await getProjectsUseCase.execute(userId);

      if (result.isSuccess()) {
        setProjects(result.value);
      } else {
        setError(result.error);
        setProjects([]);
      }
    } catch (err) {
      setError(err as Error);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const createProject = useCallback(
    async (dto: CreateProjectDTO): Promise<boolean> => {
      try {
        const createProjectUseCase = Container.createProjectUseCase();
        const result = await createProjectUseCase.execute(dto);

        if (result.isSuccess()) {
          await loadProjects();
          return true;
        } else {
          setError(result.error);
          return false;
        }
      } catch (err) {
        setError(err as Error);
        return false;
      }
    },
    [loadProjects]
  );

  const updateProject = useCallback(
    async (id: string, dto: UpdateProjectDTO): Promise<boolean> => {
      try {
        const updateProjectUseCase = Container.updateProjectUseCase();
        const result = await updateProjectUseCase.execute(id, dto);

        if (result.isSuccess()) {
          await loadProjects();
          return true;
        } else {
          setError(result.error);
          return false;
        }
      } catch (err) {
        setError(err as Error);
        return false;
      }
    },
    [loadProjects]
  );

  const deleteProject = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const deleteProjectUseCase = Container.deleteProjectUseCase();
        const result = await deleteProjectUseCase.execute(id);

        if (result.isSuccess()) {
          await loadProjects();
          return true;
        } else {
          setError(result.error);
          return false;
        }
      } catch (err) {
        setError(err as Error);
        return false;
      }
    },
    [loadProjects]
  );

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

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
