'use client';

import { useState, useCallback, useMemo } from 'react';
import { container } from '@/infrastructure/di/Container';
import type { TaskDTO, CreateTaskDTO, UpdateTaskDTO } from 'hayahub-business';
import { useEntityCRUD } from './useEntityCRUD';

interface UseTasksReturn {
  tasks: TaskDTO[];
  isLoading: boolean;
  error: Error | null;
  loadTasks: () => Promise<void>;
  loadTasksByProject: (projectId: string) => Promise<void>;
  createTask: (dto: CreateTaskDTO) => Promise<boolean>;
  updateTask: (id: string, dto: UpdateTaskDTO) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
}

/**
 * Custom Hook for Task Management
 * Uses generic useEntityCRUD with additional loadTasksByProject functionality
 */
export function useTasks(userId: string | undefined): UseTasksReturn {
  const [isLoadingByProject, setIsLoadingByProject] = useState(false);
  
  // Memoize use cases to prevent getter re-evaluation
  const getTasksUseCase = useMemo(() => container.getTasksUseCase, []);
  const createTaskUseCase = useMemo(() => container.createTaskUseCase, []);
  const updateTaskUseCase = useMemo(() => container.updateTaskUseCase, []);
  const deleteTaskUseCase = useMemo(() => container.deleteTaskUseCase, []);
  
  // Custom execute wrapper for GetTasksUseCase.executeByUser
  const getTasksWrapper = useMemo(() => ({
    execute: async (uid: string) => {
      return await getTasksUseCase.executeByUser(uid);
    }
  }), [getTasksUseCase]);

  const {
    entities: tasks,
    isLoading,
    error,
    load: loadTasks,
    create: createTask,
    update: updateTask,
    deleteEntity: deleteTask,
  } = useEntityCRUD<TaskDTO, CreateTaskDTO, UpdateTaskDTO>({
    getUseCase: getTasksWrapper,
    createUseCase: createTaskUseCase,
    updateUseCase: updateTaskUseCase,
    deleteUseCase: deleteTaskUseCase,
    getParams: userId!,
  });

  // Additional method for loading tasks by project
  const loadTasksByProject = useCallback(async (projectId: string) => {
    setIsLoadingByProject(true);

    try {
      const result = await getTasksUseCase.executeByProject(projectId);

      if (result.isSuccess()) {
        // This will be handled by parent component state
        // For now, we just validate the operation succeeded
      }
    } finally {
      setIsLoadingByProject(false);
    }
  }, [getTasksUseCase]);

  return {
    tasks,
    isLoading: isLoading || isLoadingByProject,
    error,
    loadTasks,
    loadTasksByProject,
    createTask,
    updateTask,
    deleteTask,
  };
}
