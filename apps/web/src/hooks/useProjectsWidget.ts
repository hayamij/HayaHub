'use client';

import { useEffect, useState, useCallback } from 'react';
import { container } from '@/infrastructure/di/Container';
import type { ProjectDTO, TaskDTO } from 'hayahub-business';
import { ProjectStatus } from 'hayahub-domain';

interface ProjectsWidgetStats {
  activeProjects: number;
  pendingTasks: number;
  completedTasks: number;
  completionRate: number;
}

interface UseProjectsWidgetReturn {
  tasks: TaskDTO[];
  stats: ProjectsWidgetStats;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom Hook for Projects Widget
 * Encapsulates projects and tasks data fetching with stats calculation
 */
export function useProjectsWidget(userId: string | undefined): UseProjectsWidgetReturn {
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [stats, setStats] = useState<ProjectsWidgetStats>({
    activeProjects: 0,
    pendingTasks: 0,
    completedTasks: 0,
    completionRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const getProjectsUseCase = container.getProjectsUseCase;
      const getTasksUseCase = container.getTasksUseCase;

      const [projectsResult, tasksResult] = await Promise.all([
        getProjectsUseCase.execute(userId),
        getTasksUseCase.executeByUser(userId),
      ]);

      if (projectsResult.success) {
        const allProjects = projectsResult.value;
        const activeProjects = allProjects.filter(
          (p: ProjectDTO) => p.status === ProjectStatus.IN_PROGRESS
        );

        const completed = allProjects.filter(
          (p: ProjectDTO) => p.status === ProjectStatus.COMPLETED
        ).length;

        const total = allProjects.length;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        setStats((prev) => ({
          ...prev,
          activeProjects: activeProjects.length,
          completionRate,
        }));
      }

      if (tasksResult.success) {
        const allTasks = tasksResult.value;
        setTasks(allTasks);

        const pendingTasks = allTasks.filter((t: TaskDTO) => !t.completed).length;
        const completedTasks = allTasks.filter((t: TaskDTO) => t.completed).length;

        setStats((prev) => ({
          ...prev,
          pendingTasks,
          completedTasks,
        }));
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    tasks,
    stats,
    isLoading,
    error,
    refetch: loadData,
  };
}
